import React, { useState }  from 'react';
import { IonButton, IonToast } from '@ionic/react';
import { IonInput, IonLabel, IonList, IonItemDivider, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from "react-hook-form";
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';

import './MPContainer.css';

interface ContainerProps { }

const SignInContainer: React.FC<ContainerProps> = () => {

  const { Storage } = Plugins;

  Storage.get({key:'userDetails'}).then((data: any) => {
    if (data.value) {
      let userDetails = JSON.parse(data.value);
      setValue("email", userDetails.email);
    } 
  });
  Storage.get({key:'userAlreadyExists'}).then((data: any) => {
    if (data.value) {
      var userAlreadyExistsLabel = document.getElementById("userAlreadyExistsLabel");
      if (userAlreadyExistsLabel) {
        userAlreadyExistsLabel.className = "statusLabelVisible";
      }
      setValue("email", data.value);
      Storage.remove({key:"userAlreadyExists"});
    } 
  });

  const [email, setEmail] = useState("");
  const [showToast1, setShowToast1] = useState(false);

  const forgotPassword = () => {
    if(email && email.length > 10 && email.indexOf("@") > 2) {
      fetch(host + "/forgotPassword", {
        method: 'POST', headers: {
          'Content-Type': 'application/json'}, body: JSON.stringify({email: email})})
          .then(res => res.json())
          .then(
            (result) => {
              if (result.status == "success") {
                setShowToast1(true);
              }
            },
            (error) => {
              console.log("error: " + error);
            }
          );
          // -fetch
    } else {
      alert("Please type in your email");
    }
  }

  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data : any) => {
    
    fetch(host + "/signin", {
    method: 'POST', headers: {
      'Content-Type': 'application/json'}, body: JSON.stringify({email: data.email, password: data.password})})
      .then(res => res.json())
      .then(
        (result) => {
          var userAlreadyExistsLabel = document.getElementById("userAlreadyExistsLabel");
          if (userAlreadyExistsLabel) {
            userAlreadyExistsLabel.classList.remove("displayNone");
            if (result.status == "fail") {
              userAlreadyExistsLabel.textContent = "Login failed";
              
            } else if (result.status == "success") {
              userAlreadyExistsLabel.textContent = "Login succeess";
              Storage.set({key:"userDetails", value: JSON.stringify(result.userDetails)});
              document.location.href = "/Home";
            }
          }
        },
        (error) => {
          console.log("error: " + error);
        }
      );

  };
  
  return (
    <div className="mpcontainer">
     <IonToast
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message={"An email with instruction to reset password was sent to " + email}
        duration={2000}
      />
     <form onSubmit={handleSubmit(onSubmit)}><br></br>
       <IonLabel id="userAlreadyExistsLabel" color="warning" className="displayNone">User already exists</IonLabel><br></br><br></br>
     
      {/* <IonLabel>Email</IonLabel> */}
      <IonInput name="email" placeholder="Email" value={email} onIonChange={(e)=>setEmail((e.target as HTMLInputElement).value)} type="email" maxlength={50} ref={register({ required: true, pattern: {value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: 'Email not valid.'} })} />
      <IonLabel color="warning">{errors.email && errors.email.message}</IonLabel>
      <br/>
      {/* <IonLabel>Password</IonLabel> */}
      <IonInput name="password" placeholder="Password" type="password" maxlength={20} ref={register({ required: true })} />
      <IonLabel color="warning">{errors.password && "Required"}</IonLabel>
      <br/>

      <br/>
      <IonButton size="large" fill="outline" id="cancelButton" href="Home" color="warning">Cancel</IonButton>
      
      <IonButton size="large" id="signInButton" type="submit" color="warning">Sign In</IonButton>
      <br></br><br></br>
      <IonButton fill="clear" color="warning" onClick={forgotPassword}>Forgot password?</IonButton>
      </form>
    </div>
    
  );
};


export default SignInContainer;
