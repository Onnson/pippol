import React, { useState, CSSProperties } from 'react';
import { useForm } from 'react-hook-form';

import {
  IonCheckbox,
  IonInput,
  IonButton,
  IonGrid,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonItemSliding,
} from '@ionic/react';
import * as comm from '@ionic/react';
// import '../MPContainer.css';
import { Plugins } from '@capacitor/core';
import { host } from '../../App.config.json';

interface ContainerProps {}

const TemplateName: React.FC<ContainerProps> = () => {
  const { Storage } = Plugins;
  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    fetch(host + '/***********', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        '********': '*******',
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          document.location.href = '/Home';
        },
        (error) => {
          //console.log("error: " + error);
          alert(error);
        }
      );
  };

  return (
    <>
      <IonList>
        <form onSubmit={handleSubmit(onSubmit)}></form>
      </IonList>
    </>
  );
};

export default TemplateName;
