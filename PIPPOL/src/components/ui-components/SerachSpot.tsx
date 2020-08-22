import React, { useState } from 'react';
import { IonItem, IonLabel, IonDatetime,  } from '@ionic/react';
import { IonContent, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';

// import './MPContainer.css';
import { Plugins } from '@capacitor/core';
import {host} from '../../App.config.json';

interface ContainerProps { }

const SearchSpot: React.FC<ContainerProps> = () => {

    var today = new Date();


    const customDayShortNames = [
        'ראשון',
        'שני',
        'שלישי',
        'רביעי',
        'חמישי',
        'שישי',
        'שבת'
        ];

        const [selectedDate, setSelectedDate] = useState<string>(today.toString());

        const [type, setType] = useState<string>('');

  return (
    <div className="mpcontainer maincontainer">
        <IonItem>
          <IonLabel>בחר תאריך</IonLabel>
          <IonDatetime
            min='2020-06'
            max="2022-12"
            dayShortNames={customDayShortNames}
            displayFormat="DDD DD/MMM/YYYY"
            monthShortNames="ינואר, פבואר, מרץ, אפריל, מאי, יוני, יולי, אוגוסט, ספטמבר, אוקטובר, נובמבר, דצמבר"
            value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}
          ></IonDatetime>
        </IonItem>

        <IonList>

          <IonItem>
            <IonLabel>העדפות</IonLabel>
            <IonSelect value={type} okText="Okay" cancelText="Dismiss" onIonChange={e => setType(e.detail.value)}>
              <IonSelectOption value="מסיבה">מסיבה</IonSelectOption>
              <IonSelectOption value="הופעה">הופעה</IonSelectOption>
              <IonSelectOption value="אפשרות3">אפשרות3</IonSelectOption>
              <IonSelectOption value="אפשרות4">אפשרות4</IonSelectOption>
              <IonSelectOption value="אפשרות4">אפשרו5</IonSelectOption>
              <IonSelectOption value="אפשרות4">אפשרות6</IonSelectOption>
              <IonSelectOption value="אפשרות4">אפשרות7</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItemDivider>Your Selections</IonItemDivider>
          <IonItem>Hair Color: {type}</IonItem>
        </IonList>
    </div>
  );
};

export default SearchSpot;
