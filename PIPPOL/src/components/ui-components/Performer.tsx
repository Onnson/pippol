import React, { useState, CSSProperties, useEffect } from 'react';
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
import { stringify } from 'querystring';

interface ContainerProps {
  id: string;
}

const TemplateName: React.FC<ContainerProps> = (props) => {
  const { Storage } = Plugins;

  const [performerDetails, setPerformerDetails] = useState({
    category: String,
    equipmentFromPerformer: String,
    equipmentFromProduction: String,
    facebookLink: String,
    fixPrice: Number,
    geographicalRestrictions: String,
    googleLink: String,
    name: String,
    partPrice: Number,
    remarks: String,
    slug: String,
    subCategory: String,
    youtubeLink: String,
    youtubeVideo: String,
    __v: String,
    _id: String,
  });

  useEffect(() => {
    fetch(host + '/performerDetails/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: props.id,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setPerformerDetails(result.Performer[0]);
          console.log(performerDetails);
          console.log(result.Performer[0]);
        },
        (error) => {
          alert(error);
        }
      );
  }, []);

  return (
    <div style={{ direction: 'rtl' }}>
      <IonList>
        <IonTitle>{performerDetails.name}</IonTitle>
        <IonTitle>{performerDetails.category}</IonTitle>
        <IonTitle>{performerDetails.subCategory}</IonTitle>
        <IonItemDivider>לינקים</IonItemDivider>
        <a href={`${performerDetails.facebookLink}`}>facebook</a>
        <br />
        <a href={`${performerDetails.googleLink}`}>google</a>
        <br />
        <a href={`${performerDetails.youtubeLink}`}>youtube</a>
        {/* <a href={`${performerDetails.facebookLink}`}>facebook</a> */}
      </IonList>
    </div>
  );
};

export default TemplateName;
