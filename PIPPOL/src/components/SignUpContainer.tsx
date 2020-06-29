import React, { useState }  from 'react';
import { IonButton, IonTextarea } from '@ionic/react';
import { IonInput, IonLabel, IonList, IonItemDivider, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from "react-hook-form";
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';


import './MPContainer.css';

interface ContainerProps { }



const SignUpContainer: React.FC<ContainerProps> = () => {

  const { Storage } = Plugins;

  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data : any) => {
    fetch(host + "/signup", {
    method: 'POST', headers: {
      'Content-Type': 'application/json'}, body: JSON.stringify({name: data.name, email: data.email, phone: data.phone, password: data.password})})
      .then(res => res.json())
      .then(
        (result) => {
          if ("exists" == result.status) {
            Storage.set({key:"userAlreadyExists", value: result.email}); 
            document.location.href = "/SignIn";
          } else if ("success" == result.status) {
            Storage.set({key:"userDetails", value: JSON.stringify(result.userDetails)});
            document.location.href = "/Home";
          }
        },
        (error) => {
          //console.log("error: " + error);
          alert(error);
        }
      );

  };

  return (
    <div className="mpcontainer">
     
     <form onSubmit={handleSubmit(onSubmit)}>
     
      <br/><br/>
      {/* <IonLabel>Name</IonLabel> */}
      <IonInput name="name" placeholder="Name" maxlength={50} ref={register({ required: {value: true, message: 'Name is required'}, pattern: {value: /^[A-Za-z ]+$/i, message: 'Only letters are allowed.'} })} />
      <IonLabel color="warning">{errors.name && errors.name.message}</IonLabel>
      <br/>
      {/* <IonLabel>Email</IonLabel> */}
      <IonInput name="email" placeholder="Email" type="email" maxlength={50} ref={register({ required: {value: true, message: 'Email is required'}, pattern: {value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: 'Email not valid.'} })} />
      <IonLabel color="warning">{errors.email && errors.email.message}</IonLabel>
      <br/>
      {/* <IonLabel>Password</IonLabel> */}
      <IonInput name="password" placeholder="Password" type="password" maxlength={20} ref={register({ required: {value: true, message: 'Password is required'}, minLength: {value: 6, message: 'Password too short.'} })} />
      <IonLabel color="warning">{errors.password && errors.password.message}</IonLabel>
      <br/>
      {/* <IonLabel>Phone</IonLabel> */}
      <IonInput name="phone" placeholder="Phone" type="tel" maxlength={50} ref={register({ required: {value: true, message: 'Phone is required'}, minLength: {value: 7, message: 'Phone too short'}, pattern: {value: /^[0-9\+\- ]+$/, message: 'Only numbers are allowed.'} })} />
      <IonLabel color="warning">{errors.phone && errors.phone.message}</IonLabel>
      
        

      <br/><br/>      
      <IonButton size="large" id="saveButton" href="Home" type="submit" color="warning">Sign Up</IonButton>
      <br></br><br></br>
      <IonButton href="signin" color="warning" fill="clear">Sign in</IonButton>
      
      <br/><br/>
      </form>
    </div>
    
  );
};


export default SignUpContainer;
