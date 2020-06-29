import React, { useState }  from 'react';
import { IonButton, IonTextarea } from '@ionic/react';
import { IonInput, IonLabel, IonList, IonItemDivider, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from "react-hook-form";
import { Plugins } from '@capacitor/core';


import './MPContainer.css';
import { Redirect } from 'react-router';

interface ContainerProps { }

const SignInContainer: React.FC<ContainerProps> = () => {

  const { Storage } = Plugins;

  Storage.remove({key:'userDetails'});
  document.location.href = "/SignUp";

  return (
    <div className="mpcontainer">
     signed out
    </div>
    
  );
};


export default SignInContainer;
