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
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import * as comm from '@ionic/react';
// import '../MPContainer.css';
import { Plugins } from '@capacitor/core';
import { host } from '../../App.config.json';

interface ContainerProps {}

const TemplateName: React.FC<ContainerProps> = () => {
  const { Storage } = Plugins;
  const [performerList, setPerformerList] = useState([]);

  useEffect(() => {
    fetch(host + '/PerformerList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setPerformerList(result.Performers);
          console.log(performerList);
          console.log(result.Performers);
        },
        (error) => {
          alert(error);
        }
      );
  }, []);
  return (
    <>
      <IonList>
        {performerList &&
          performerList.map((item) => {
            return (
              <IonCard href={`/performer/${item['_id']}`}>
                <IonCardHeader>
                  <IonCardSubtitle>{item['category']}</IonCardSubtitle>
                  <IonCardTitle>{item['name']}</IonCardTitle>
                </IonCardHeader>
              </IonCard>
            );
          })}
      </IonList>
    </>
  );
};

export default TemplateName;
