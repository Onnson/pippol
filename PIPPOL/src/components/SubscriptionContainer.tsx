import React, { useState }  from 'react';
import { IonButton, IonToast, IonRadioGroup, IonRadio, IonItem, IonGrid, IonRow, IonCol, IonAlert } from '@ionic/react';
import { IonInput, IonLabel, IonList, IonItemDivider, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from "react-hook-form";
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';

// stripe
// import ReactDOM from 'react-dom';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import {CardElement} from '@stripe/react-stripe-js';
// import './CardSectionStyles.css';

// google play / revenuecat
import { Purchases, PURCHASE_TYPE, PurchaserInfo } from '@ionic-native/purchases';

import './MPContainer.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};


interface ContainerProps { }

let userDetails : any;

// const stripePromise = loadStripe("pk_test_51GqImjCkVJjzCTQ65UBwpUrGsvReSSnWazBLo4l7WFq1mqDTk2GOi4GL4J1WAgaFcjeaCasATRRgMmOkYt0KCjFF00svgaDg7B");
// let card : any;
// let stripe : any;

let subType = "premium";
let initted = false;

const SubscriptionContainer: React.FC<ContainerProps> = () => {

  const { Storage } = Plugins;

  const [currentSubType, setCurrentSubType] = useState("");

  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");
  if (!initted) {
    initted = true;
    Storage.get({key:'userDetails'}).then((data: any) => {
      if (data.value) {
        userDetails = JSON.parse(data.value);
        if (userDetails && userDetails.userType > 1 && userDetails.userType < 4) {
          setHasSubscription(true);
          if (userDetails.billing && userDetails.billing.cancelled) {
            setSubscriptionEndDate(new Date(userDetails.billing.subEndDate).toDateString());
          }
        }

        Purchases.setDebugLogsEnabled(true);
        Purchases.setup("PK----", userDetails.email);

        verifyPurchaseGooglePlay(null);
      } 
    });
  }
  
  const [toastMsg, setToastMsg] = useState("");
  const [showToast1, setShowToast1] = useState(false);

  const showToast = (msg : string) => {
    // disabled because it causes rerender, stripe card form loses information...
    setToastMsg(msg);
    setShowToast1(true);
    // alert(msg);
  }



  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data : any) => {
    
    return;
  };
  
  const subscriptionUnChosed = () => {

  }
  function handleSelectType (type : string) {
    // if (type == "gold") {
    //   showToast("Gold subscription not available right now.");
    //   return;
    // }
    subType = type;
    const checkbox = document.getElementById(type);
    if (checkbox) (checkbox as HTMLInputElement).checked = true;

    // const premiumGoldElements:string[][] = [["premiumImage", "premium", "premiumPrice"],["goldImage", "gold", "goldPrice"]];
    // for (let i1 = 0; i1 < premiumGoldElements.length; i1++) {
    //   for (let i2 = 0; i2 < premiumGoldElements[i1].length; i2++) {
    //     const premiumElement = document.getElementById(premiumGoldElements[i1][i2]);
    //     if (premiumElement) {
    //       let show = (i1 == 0 && type == 'premium') || (i1 == 1 && type == 'gold');
    //       if (show) (premiumElement as HTMLElement).classList.remove("subscriptionUnChosen");
    //       if (!show) (premiumElement as HTMLElement).classList.add("subscriptionUnChosen");
    //     }
    //   }
    // }

  }

  // Stripe disabled
  // stripePromise.then((stripe1)=>{
  //   if (stripe1 && document.getElementById("card-element")) {
  //     var elements = stripe1.elements();
  //     card = elements.create('card', CARD_ELEMENT_OPTIONS);
  //     card.mount('#card-element');
  //     stripe = stripe1;
  //   }
  // });

  function createPaymentMethodStripe(stripe : any, cardElement : any, /*customerId : any,*/ priceId : any) {
    
      if (stripe)
      stripe
      .createPaymentMethod({
        type: 'card',
        card: cardElement,
      })
      .then((result : any) => {
        if (result.error) {
          console.log(result.error);
          showToast(result.error.message);
        } else {
          createSubscriptionStripe(
             result.paymentMethod.id,
             priceId
          );
        }
      });
    // });
  }

  function createSubscriptionStripe(  paymentMethodId : any, priceId :any  ) {
    return (
      fetch(host + '/createSubscriptionStripe', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          // customerId: customerId,
          token: userDetails.login.token,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
          reSubscribe: resubscribe
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the addional details we need.
        .then((result) => {
          return {
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            subscription: result,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        // .then(handlePaymentThatRequiresCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        // .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        // .then(onSubscriptionComplete)
        .then((res)=>{
          if (res.subscription.status == "active") {
            // alert("You're not a PREMIUM user!");
            document.location.href = "/Home";
          }
        })
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          // showCardError(error);
          console.log(error);
          showToast(error.error.message);
        })
    );
  }

  // pform data
  const [cardno, setCardno] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  function psubscribe () {
    // fetch(host + "/createPSubscription", {
    //   method: 'POST', headers: {
    //     'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token, 
    //       cardno: cardno, cardholder: cardholder, expiry: expiry, cvc: cvc, subType: subType})})
    //     .then(res => res.json())
    //     .then(
    //       (result) => {
    //         if ("success" == result.status) {
    //           alert(result.details);
    //         }
    //       },
    //       (error) => {
    //         //console.log("error: " + error);
    //         alert(error);
    //       }
    //     );
    // -fetch
  }

  function subscribe () {
    // Stripe disabled
    // createPaymentMethodStripe(stripe, card, "price_1GqIpUCkVJjzCTQ6oRzP2ea6");
 
    // psubscribe
    //  psubscribe();
   
    // gogle 
    googlePlaySubscribe();
  }

  function googlePlaySubscribe () {
    

    // Purchases.getPurchaserInfo().then((purchaserInfo)=>{
    //   if (purchaserInfo.activeSubscriptions.length > 0) {
    //     // todo: report error to server, shouldn't get here if active sub exist
    //     let activeSubs = "";
    //     for (let i = 0; i < purchaserInfo.activeSubscriptions.length; i++) {
    //       activeSubs += purchaserInfo.activeSubscriptions[i];
    //       if (i < purchaserInfo.activeSubscriptions.length - 1) activeSubs += ", ";
    //     }
    //     alert("You already have active subscriptions: " + activeSubs);
    //     return;
    //   }

    // todo: upgrade?
      
      Purchases.getOfferings().then((res)=>{
        // alert("foo: " + res.all['offer-premium'].monthly?.offeringIdentifier);
        let ppp = res.all['offer-' + subType].monthly;
        if (ppp)
        Purchases.purchasePackage(ppp).then(({productIdentifier : string, purchaserInfo : PurchaserInfo})=>{
          
          // todo: verify sub on server (there adjust userType, send back)
          verifyPurchaseGooglePlay(function (res : any) {
            if (res) {
              alert("You are now a " + (res == 2? "Premium":"Gold") + " subscriber.");
              document.location.href = "/Home";
            } else {
              showToast("Subscribe failed.")
            }
          });
        }).catch((err)=>{
          console.log(err);
          showToast("Subscribe purchase failed.");
        });
      });
    // });
  }

  function verifyPurchaseGooglePlay (cb : any) {
    
    // Purchases.getPurchaserInfo().then((purchaserInfo)=>{
    // if (purchaserInfo.activeSubscriptions.length > 0) {
    //   // todo: report error to server, shouldn't get here if active sub exist
    //   let activeSubs = "";
    //   for (let i = 0; i < purchaserInfo.activeSubscriptions.length; i++) {
    //     activeSubs += purchaserInfo.activeSubscriptions[i];
    //     if (i < purchaserInfo.activeSubscriptions.length - 1) activeSubs += ", ";
    //   }
    //   alert("You already have active subscriptions: " + activeSubs);
    //   return;
    //   }}).catch((err)=>{alert(err);});

    // return;

    fetch(host + "/verifySubscription", {
      method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status == "success" && result.subType > 1) {
              console.log("Subscription exists.");
              if (cb) cb(result.subType);
              setHasSubscription(true);
              setCurrentSubType(result.subType == 3? "Gold":"Premium");
              
              // alert("has");
              // setSubscriptionEndDate(new Date(userDetails.billing.subEndDate).toDateString());
              // document.location.href = "/Home";
            } else {
              console.log("Subscription doesn't exist.");
              if (cb) cb(null);
              setHasSubscription(false);
              // alert("has none");
            }
          },
          (error) => {
            console.log("error: " + error);
            if (cb) cb(null);
            setHasSubscription(false);
            // alert("has none");
          }
        );
        // -fetch
  }
  

  const [resubscribe, setResubscribe] = useState(false);
  function doResubscribe () {
    setResubscribe(true);
  }

  const [showAlertCancel, setShowAlertCancel] = useState(false);


  function cancelSubscription () {
    // cancelSubscriptionStripe();
    cancelSubscriptionGooglePlay();
  }

  function cancelSubscriptionGooglePlay () {

    showToast("To cancel an active subscription use the Google Play store.");
    return;

    // fetch(host + "/cancelSubscriptionGoogle", {
    //   method: 'POST', headers: {
    //     'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
    //     .then(res => res.json())
    //     .then(
    //       (result) => {
    //         if (result.status == "success") {
    //         setHasSubscription(false);
    //         showToast("Subscription cancelled.");
    //         // document.location.href = "/Home";
    //         } else {
    //           showToast("Subscription cancellation failed.");
    //         }
    //       },
    //       (error) => {
    //         console.log("error: " + error);
    //         showToast("Subscription cancellation failed.");
    //       }
    //     );
        // -fetch
  }

  function cancelSubscriptionStripe () {
    // disabled for now
    return;
    fetch(host + "/cancelSubscriptionStripe", {
      method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status == "success") {
              showToast("Subscription cencelled.");
              document.location.href = "/Home";
            } else {
              showToast("Subscription cancellation failed.");
            }
          },
          (error) => {
            console.log("error: " + error);
            showToast("Subscription cancellation failed.");
          }
        );
        // -fetch
  }

  return (
    <div className="mpcontainer">
     <IonToast
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message={toastMsg}
        duration={2000}
      />
      <IonAlert
          isOpen={showAlertCancel}
          onDidDismiss={() => setShowAlertCancel(false)}
          cssClass='my-custom-class'
          // header={'Premium feature'}
          // subHeader={'Add more emergency contacts'}
          message={'Are you sure you want to cancel your PREMIUM subscription?.'}
          buttons={[
            {
              text: 'Oops',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Cancel subscription',
              handler: () => {
                console.log('Confirm Okay');
                cancelSubscription();
              }
            }
          ]}/>
     <form onSubmit={handleSubmit(onSubmit)}><br></br>
     
     <IonGrid className="subscriptionGrid">
       <IonRow>
         <IonCol>
            <img src="assets/icon/premium.svg" id="premiumImage" height="125" onClick={()=>{handleSelectType('premium');}}/><br/><br/>
            {/* <IonRadio color="warning" className="subscriptionRadio"  name="premium" id="premium" value="premium"></IonRadio> */}
            <input type="radio" name="subscriptionRadio" checked value="premium" id="premium" className=""></input>
          <IonItem>
          <div id="premiumPrice" className="subscriptionPrice">$5/Mo</div>
          </IonItem>
         </IonCol>
         <IonCol>
            <img src="assets/icon/gold.svg" id="goldImage" height="125" className="" onClick={()=>{handleSelectType('gold');}}/><br/><br/>
            {/* <IonRadio color="warning" className="subscriptionRadio" name="gold" id="gold" value="gold"></IonRadio> */}
            <input type="radio" name="subscriptionRadio" value="gold" id="gold" className=""></input>
          <IonItem>
          <div id="goldPrice" className="subscriptionPrice">$10/Mo</div>
          </IonItem>
         </IonCol>
       </IonRow>
     </IonGrid>
     
     <IonLabel color="medium" className="smallLabel paddingbottom"><div className="leftalign-nofloat">
     Upgrade to a <span className="warn">Premium Subscription</span> to add up to 10 emergency contacts and get 1 new emergency activation credit every week (you can hoard up to 5 credits).
     <br/><br/>
     Upgrade to a <span className="warn">Gold Subscription</span> if you want <b>SOS Box (24/7) Emergency Control Center</b> operators to contact your local emergency services in case you're in trouble and follow through until you're safe.
     </div></IonLabel>
     <br/>
     {/* <IonLabel color="warning" className=""></IonLabel> */}
      <br/>
{!resubscribe && hasSubscription? (
       <div id="hasSubscriptionDiv" className="white">
         {currentSubType.length > 0? (
           <div>
       You are currently a {currentSubType} user.</div>
         ):""}
       {subscriptionEndDate != ""? (
         <div><br/>
           Your subscription will end on {subscriptionEndDate}
         </div>
       ):(
         ""
         )}
       </div>
       ):""}
       {resubscribe || !hasSubscription? (
         <div>
            <IonGrid className="">
            <IonRow>
              <IonCol className="white">
                <img src="assets/icon/google-play-store.png" height="32" className="googlePlayIcon"/> &nbsp;
                Subscribe with Google Play
              </IonCol>  
            </IonRow>  
          </IonGrid>
          <div id="stripeForm" className="displayNone">
            <IonLabel color="warning" className="">Credit Card Details:</IonLabel>
          <IonItem>
          <div id="card-element"></div>
          </IonItem>
          </div>
         </div>
       ):""}
       <div id="comingSoonDiv" className="white displayNone">
         Premium and Gold subscriptions coming soon.
       </div>
       <div id="creditCardForm" className="displayNone">
       <IonItem>
      <IonInput name="cardNumber" placeholder="Card Number" type="tel" value={cardno} onIonChange={(e)=>setCardno((e.target as HTMLInputElement).value)} maxlength={16} ref={register({ required: true })} />
      <IonLabel color="warning">{errors.cardNumber && "Required"}</IonLabel>
      </IonItem>
      <IonItem>
      <IonInput name="cardHolderName" placeholder="Card Holder Name" value={cardholder} onIonChange={(e)=>setCardholder((e.target as HTMLInputElement).value)} type="text" maxlength={50} ref={register({ required: true })} />
      <IonLabel color="warning">{errors.cardHolderName && "Required"}</IonLabel>
      </IonItem>
      <IonItem>
      <IonInput name="mmyy" placeholder="MM/YY" type="tel" maxlength={4} value={expiry} onIonChange={(e)=>setExpiry((e.target as HTMLInputElement).value)} ref={register({ required: true })} />
      <IonLabel color="warning">{errors.mmyy && "Required"}</IonLabel>
      <IonInput name="cvc" placeholder="CVC" type="tel" maxlength={3} value={cvc} onIonChange={(e)=>setCvc((e.target as HTMLInputElement).value)} ref={register({ required: true })} />
      <IonLabel color="warning">{errors.cvc && "Required"}</IonLabel>
      </IonItem>
      </div>
      
      
      <br/>

      <br/>
      <IonButton size="large" fill="outline" id="cancelButton" href="Home" color="warning">Cancel</IonButton>
      {(hasSubscription && subscriptionEndDate == "")? (
        <IonButton size="large" id="subscribeButtonDisabled" disabled type="button" color="warning">Subscribe</IonButton>
      ):(!resubscribe && hasSubscription)?(
        <IonButton size="large" id="subscribeButton" disabled={false} type="button" color="warning" onClick={()=>{doResubscribe();}}>Re-Subscribe</IonButton>
      ):(
        <IonButton size="large" id="subscribeButton" disabled={false} type="button" color="warning" onClick={()=>{subscribe();}}>Subscribe</IonButton>
      )}
      

      <br/><br/>

      {(hasSubscription && subscriptionEndDate == "")? (
      <div>
      <IonButton size="small" id="cancelSubButton" type="submit" color="warning" fill="clear" onClick={()=>{setShowAlertCancel(true)}}>Cancel subscription</IonButton>
      <br/><br/>
      </div>
      ):""}

<IonButton size="small" id="creditCardButton" type="submit" color="warning" fill="clear" onClick={()=>{showToast('Not available at this time');}}>Buy with Credit or Debit Card instead</IonButton>
{/* <IonButton size="small" id="creditCardButton" type="submit" color="warning" fill="clear" onClick={()=>{showToast('Not available at this time');}}>Buy with Google Play instead</IonButton> */}
<br/><br/>
      </form>
    </div>
    
  );
};


export default SubscriptionContainer;
