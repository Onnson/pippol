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
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonModal,
  IonText,
} from '@ionic/react';
import * as comm from '@ionic/react';
// import '../MPContainer.css';
import { Plugins } from '@capacitor/core';
import { host } from '../../App.config.json';

interface ContainerProps {}

const subPrivateEng = ['Roof', 'Yard', 'House', 'Appartment'];
const subPrivateHeb = ['גג', 'חצר', 'בית', 'מרתף'];

const subCommercialEng = ['Pub', 'Club', 'Museum', 'Other'];
const subCommercialHeb = ['פאב', 'מועדון', 'מוזיאון', 'אחר'];

const NewSpot: React.FC<ContainerProps> = () => {
  const { Storage } = Plugins;
  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data: any) => {
    data['category'] = category;
    data['subCategory'] = subCategory;
    console.log(data);
    fetch(host + '/NewSpot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data,
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

  const [category, setCategory] = useState<string>('Private');
  const [subCategory, setSubCategory] = useState<string>('Roof');
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState({
    count: 1,
    1: { price: 0, fraction: 0 },
  });

  return (
    <div style={{ direction: 'rtl' }}>
      <IonList>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonTitle>הוספת ספוט חדש</IonTitle>
          <IonItemGroup>
            <IonInput
              name="name"
              placeholder="שם הספוט"
              maxlength={50}
              ref={register({ required: { value: true, message: 'נדרש להוסיף שם ספוט' } })}
            ></IonInput>
            <IonLabel color="warning">{errors.name && errors.name.message}</IonLabel>
          </IonItemGroup>

          <IonRadioGroup
            value={category}
            onIonChange={(e) => {
              setCategory(e.detail.value);
              setSubCategory('');
            }}
          >
            <IonTitle>קטגוריה</IonTitle>

            <IonItem>
              <IonLabel>פרטי</IonLabel>
              <IonRadio slot="start" value="Private" />
            </IonItem>

            <IonItem>
              <IonLabel>מסחרי</IonLabel>
              <IonRadio slot="start" value="Commercial" />
            </IonItem>
          </IonRadioGroup>

          <br />
          <IonTitle>תת קטגוריה</IonTitle>

          {category == 'Private' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subPrivateEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subPrivateHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          {category == 'Commercial' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subCommercialEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subCommercialHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          <br />

          <IonItemDivider>כתובת</IonItemDivider>
          <IonInput placeholder="שם העיר" name="city" ref={register()}></IonInput>
          <IonInput placeholder="שם הרחוב" name="street" ref={register()}></IonInput>
          <IonInput placeholder="מספר" name="addersNumber" ref={register()}></IonInput>
          <br />

          <IonItemDivider>קישורים</IonItemDivider>
          <div style={{ direction: 'ltr' }}>
            <IonInput placeholder="אתר הבית" name="webSite" type="url" ref={register()}></IonInput>
            <IonInput placeholder="Facebook" name="facebookLink" type="url" ref={register()}></IonInput>
            <IonInput placeholder="youtube" name="youtubeLink" type="url" ref={register()}></IonInput>
            <IonInput placeholder="google" name="googleLink" type="url" ref={register()}></IonInput>
          </div>
          <br />

          <IonItemDivider>פרטים על המקום</IonItemDivider>
          <IonInput placeholder="מספר אורחים מקסימלי" type="number" name="maxGuest" ref={register()}></IonInput>
          <IonInput placeholder="מקומות חניה" type="number" name="parkingNumber" ref={register()}></IonInput>
          <br />

          <IonItemDivider> ציוד וצוות מקצועי</IonItemDivider>
          <IonInput placeholder="ציוד קיים" name="existingEquipment" ref={register()}></IonInput>
          <IonInput placeholder="ציוד נדרש" name="requiredEquipment" ref={register()}></IonInput>
          <IonInput placeholder="צוות מקצועי קיים" name="existingStaff" ref={register()}></IonInput>
          <IonInput placeholder="צוות מקצועי נדרש" name="requiredStaff" ref={register()}></IonInput>
          <br />

          <IonItemDivider>מחיר</IonItemDivider>
          <IonItemGroup>
            {/* <IonInput placeholder="כותרת"></IonInput> */}
            <IonItem>
              {/* <IonText>1.</IonText> */}
              <IonInput placeholder="סכום קבוע" type="number" name="fixPrice" ref={register()}></IonInput>
              <IonText>+</IonText>
              <IonInput placeholder="אחוז מהכנסות" type="number" name="partPrice" ref={register()}></IonInput>
            </IonItem>
            {/* <IonButton>הוסף אפשרות תשלום</IonButton> */}
            {/* <IonInput placeholder="ציוד באחריות המופיע" name="equipmentFromPerformer" ref={register()}></IonInput>
            <IonInput placeholder="ציוד באחריות המזמין" name="equipmentFromProduction" ref={register()}></IonInput> */}
          </IonItemGroup>

          <IonItemDivider>הערות ומגבלות</IonItemDivider>
          <IonInput placeholder="תוספות" name="extras" ref={register()}></IonInput>
          <IonInput placeholder="הערות" name="remarks" ref={register()}></IonInput>

          <IonButton expand="block" size="large" id="saveButton" href="Home" type="submit" color="warning">
            הוספת ספוט חדש
          </IonButton>
        </form>
      </IonList>
    </div>
  );
};

export default NewSpot;
