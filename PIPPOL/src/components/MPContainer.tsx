import React, { useState } from 'react';
import { IonButton, IonLabel, IonInput, IonItemGroup, IonItem, IonModal, IonRange, IonAlert, IonToast } from '@ionic/react';
import './MPContainer.css';
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';
// import { Purchases, PURCHASE_TYPE, PurchaserInfo } from '@ionic-native/purchases';

interface ContainerProps { }

let userDetails : any;
let initted = false;

const MPContainer: React.FC<ContainerProps> = () => {

  const { Storage, Geolocation } = Plugins;

  const [showAlertWhatAreCredits, setShowAlertWhatAreCredits] = useState(false);

  const [showAlertRate, setShowAlertRate] = useState(false);
  
  const [credits, setCredits] = useState(0);
  const [nonExistingCredits, setNonExistingCredits] = useState("");
  const [existingCredits, setExistingCredits] = useState("Connecting...");
  
  if (!initted) {
    initted = true;
    
    // +Rate app
    Storage.get({key:'lastScreen'}).then((data: any) => {
      if ("IMIN" == data.value) {
        Storage.remove({key: "lastScreen"});
        Storage.get({key:'rateApp'}).then((data: any) => {
          if ("NO" != data.value) {
            setShowAlertRate(true);
          }
        });
      }
    });
    // -Rate app
    if (host.indexOf("10.0.0.4")) {
      // Purchases.setDebugLogsEnabled(true);
      // Purchases.setup("PKsTgGkiAlPMbgAwBbntjYvzeInPmhAs", "eyalatu812@gmail.com");

      // if (false)
      // Purchases.getProducts(['fake','gold','premium', 'android.test.purchased']).then((products)=>{
        // alert("foo: " + products.length + " - " + products[0].identifier);
        // Purchases.getPurchaserInfo().then((purchaserInfo)=>{
          
          // if (false)
          // Purchases.purchaseProduct('premium', null, PURCHASE_TYPE.INAPP).then((e)=> {
          //   alert(e);
          //   }).catch((err)=>{
          //     alert("err: " + err.error.code + " - " + err.error.message + " - " + err.error.underlyingErrorMessage);
          //   });

        // });
        
      // });

      // if (false)
      // Purchases.getPurchaserInfo().then((purchaserInfo)=>{
      //   alert("activeSubscriptions: " + purchaserInfo.activeSubscriptions[0]);
        // alert("activeSubscriptions: " + purchaserInfo.activeSubscriptions.length);
        // alert("allPurchasedProductIdentifiers: " + purchaserInfo.allPurchasedProductIdentifiers.length);
        // alert(purchaserInfo.entitlements.);
      // });
      
      // if (false)
      // Purchases.getOfferings().then((res)=>{
      //   // alert("foo: " + res.all['offer-premium'].monthly?.offeringIdentifier);
      //   let ppp = res.all['offer-premium'].monthly;
      //   if (ppp)
      //   Purchases.purchasePackage(ppp).then(({productIdentifier : string, purchaserInfo : PurchaserInfo})=>{
      //     alert(33);
      //   }).catch((err)=>{
      //     alert(err);
      //   });
      // });
      
      
      
      // try {
      //   const {purchaserInfo, productIdentifier} = await Purchases.purchasePackage('premium');
      //   if (typeof purchaserInfo.entitlements.active.my_entitlement_identifier !== "undefined") {
      //     // Unlock that great "pro" content
      //   }
      // } catch (e) {
      //   if (!e.userCancelled) {
      //     console.log(e);
      //   }
      // }
      
      
      // Note: if you are using purchaseProduct to purchase Android In-app products, an optional third parameter needs to be provided when calling purchaseProduct. You can use the package system to avoid this
      // await Purchases.purchaseProduct("product_id", null, Purchases.PURCHASE_TYPE.INAPP);
      
    
      // Note: if you are using purchaseProduct to purchase Android In-app products, an optional third parameter needs to be provided when calling purchaseProduct. You can use the package system to avoid this.
      
      // Purchases.purchaseProduct("product_id", ({ productIdentifier, purchaserInfo }) => {
      // }, ({error, userCancelled}) => {
      //     // Error making purchase
      // }, null, Purchases.PURCHASE_TYPE.INAPP);

  }
    // end purchase


    Storage.get({key:'userDetails'}).then((data: any) => {
      var setup = document.getElementById("setup");
      if (setup) {
        if (data.value) {
          setup.setAttribute("href", "Setup");
          userDetails = JSON.parse(data.value);

          // fetch
          fetch(host + "/getCredits", {
            method: 'POST', headers: {
              'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
              .then(res => res.json())
              .then(
                (result) => {
                  if (result.status == "success") {
                    userDetails = result.userDetails;
                    const userDetailsStringified = JSON.stringify(userDetails);
                    Storage.set({key:"userDetails", value: userDetailsStringified});
                    updateCredits();
                  } else {
                    console.log("server error");
                  }
                },
                (error) => {
                  console.log("error: " + error);
                }
              );
          // -fetch
        } else {
          setup.setAttribute("href", "SignUp");
          document.location.href = "/SignUp";
        }
      }
    });
  }

  const [locationInput, setLocationInput] = useState("");

  const [minutesToWait, setMinutesToWait] = useState(2);

  const updateLocation = () => {
    
    Geolocation.getCurrentPosition().then((coordinates) => {
      console.log('Current position', coordinates);
      Storage.set({key:"LocationInputCords", value: JSON.stringify({lat: coordinates.coords.latitude, lon: coordinates.coords.longitude})});
      fetch("https://api.opencagedata.com/geocode/v1/json?q=" + coordinates.coords.latitude + ",%20" + coordinates.coords.longitude + "&key=968156be62714dd4bbefb7b6ad921044")
          .then(res => res.json())
          .then(
            (result) => {
              setLocationInput(result.results[0].formatted);
            },
            (error) => {
              console.log("error: " + error);
            }
          );

    }).catch((err)=>{
      console.log(err);
    });

  }

  const imin = () => {
    Storage.set({key:"LocationInput", value: locationInput});
    Storage.set({key:"MinutesToWait", value: minutesToWait.toString()});
    document.location.href = "/ImIn";
  }

  function updateLocationInput (locInput : any) {
    setLocationInput(locInput);
  }

  const [showModal, setShowModal] = useState(false);

  function updateCredits () {
    setCredits(userDetails.credits);
              let existing = "", nonExisting = "";
              for (let i = 0; i < 5; i++) {
                if (i <= userDetails.credits - 1) {
                  existing += "☎ ";
                } else {
                  nonExisting += " ☎";
                }
              }
              setExistingCredits(existing);
              setNonExistingCredits(nonExisting); 
  }

  const goingIn = () => {
    if (!userDetails.emailConfirmed) {
      setCompleteProfileMsg("Please confirm your email first");
      setShowToast1(true);
      return;
    }
    let compelteProfile = "Please complete your profile ";
    if (!userDetails.country) {
      setCompleteProfileMsg(compelteProfile + "(add your country)");
      setShowToast1(true);
      return;
    }
    if (!userDetails.emergencyContacts || userDetails.emergencyContacts.length == 0 || userDetails.emergencyContacts[0].phone.length < 9) {
      setCompleteProfileMsg(compelteProfile + "(add 1 emergency contact)");
      setShowToast1(true);
      return;
    }
    fetch(host + "/getCredits", {
      method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status == "success") {
              userDetails = result.userDetails;
              const userDetailsStringified = JSON.stringify(userDetails);
              Storage.set({key:"userDetails", value: userDetailsStringified});
              updateCredits(); 
              if (credits > 0) {
                setShowModal(true); 
                updateLocation();
              } else {
                setShowAlertWhatAreCredits(true);
              }
              
            } else {
              console.log("server error");
            }
          },
          (error) => {
            console.log("error: " + error);
          }
        );
    
  }
  const [showToast1, setShowToast1] = useState(false);
  const [completeProfileMsg, setCompleteProfileMsg] = useState("");

  return (
    <div className="mpcontainer maincontainer">

<IonAlert
          isOpen={showAlertRate}
          onDidDismiss={() => {setShowAlertRate(false);}}
          cssClass='alert-button-group'
          header={'Rate Our App'}
          // subHeader={'Add more emergency contacts'}
          message={"We need your help.<br><br>If you love SOS Box, please take a moment to <b>write a review</b> and give us a <b>5-Star Rating</b> on Play Store." }
          buttons={(()=> {
            let ret = [];
            ret.push({
              text: 'Later',
              role: 'cancel',
              cssClass: 'secondary'
            });
            ret.push({
              text: "SURE! LET'S BEGIN",
              cssClass: "sureRate",
              handler: () => {
                Storage.set({key:"rateApp", value: "NO"});      
                window.open('http://play.google.com/store/apps/details?id=app.pippol');
              }
            });
            
            return ret;
          })()
          }/>

      <IonToast
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message={completeProfileMsg}
        duration={5000}
      />
      <IonAlert
          isOpen={showAlertWhatAreCredits}
          onDidDismiss={() => setShowAlertWhatAreCredits(false)}
          cssClass='my-custom-class'
          // header={'Premium feature'}
          // subHeader={'Add more emergency contacts'}
          message={"You have " + credits + " emergency activation credits left." + 
          ((userDetails && userDetails.userType > 1? "":"<br><br> With a Free Account you get 1 new credit every month. <br><br>Upgrade to a <a color='warning' href='/subscription'>Premium Subscription</a> to get 1 new credit every week, and add up to 10 emergency contacts.")) }
          buttons={(()=> {
            let ret = [];
            ret.push({
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            });
            if (!userDetails || userDetails.userType == 1) {
              ret.push({
                text: 'Upgrade',
                handler: () => {
                  document.location.href = '/subscription';
                }
              });
            }
            return ret;
          })()
          }/>
      <IonModal isOpen={showModal} cssClass='imokmodal blackbg'> 
        <IonItemGroup className="blackbg">
          <IonItem className="blackbg">
            <p>Describe your location:</p>
          </IonItem>
          <IonItem className="blackbg">
          <IonInput maxlength={150} onIonChange={(e)=>updateLocationInput((e.target as HTMLInputElement).value)} value={locationInput} placeholder="Describe yout location" className="locationInput"></IonInput> 
          </IonItem>
          <IonItem className="blackbg">
            <IonLabel>Call help after {minutesToWait} minutes</IonLabel><br/>
          </IonItem>
          <IonItem className="blackbg">
            <IonRange color="warning" value={minutesToWait} min={1} max={10} step={1} snaps={true} onIonChange={(e)=>setMinutesToWait(Number.parseInt((e.target as HTMLInputElement).value))}>
            <IonLabel slot="start">1</IonLabel>
              <IonLabel slot="end">10</IonLabel>
            </IonRange>
          </IonItem>
          <IonItem className="blackbg">
            <IonButton className="modalButton" fill="outline" onClick={() => setShowModal(false)} color="warning">Cancel</IonButton>
            <IonButton className="modalButton" onClick={()=>{imin();}} color="warning">OK</IonButton>
          </IonItem>
        </IonItemGroup>
      </IonModal>
      <IonLabel className="cursorPointer fullCredits" onClick={()=>{setShowAlertWhatAreCredits(true)}} color="warning">{existingCredits}</IonLabel> 
      <IonLabel className="cursorPointer emptyCredits" onClick={()=>{setShowAlertWhatAreCredits(true)}} color="medium">{nonExistingCredits}</IonLabel>
     <br/><br/><br/><br/>

        <img onClick={()=>{goingIn()}} src="assets/icon/goingin2.svg" height="313" className="goingin"/>
      <br/><br/><br/><br/>
      <a href="/Home" id="setup"><img src="assets/icon/setup.svg" height="42"></img></a>
       
      
    </div>
  );
};

export default MPContainer;
