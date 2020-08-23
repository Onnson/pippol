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

const subMusicEng = ['dj', 'band', 'singer', 'player'];
const subMusicHeb = ['Dj', 'להקה', 'זמר', 'שחקן'];

const subShowEng = ['comedy', 'play', 'other'];
const subShowHeb = ['בידור', 'הצגה', 'מופע אחר'];

const subPresentationEng = ['juggler', 'moderator'];
const subPresentationHeb = ['להטוטן', 'מנחה'];

const subWorkshopEng = ['Lecture', 'Class', 'Other'];
const subWorkshopHeb = ['הרצאה', 'הוראה', 'סדנה אחר'];

const NewSpot: React.FC<ContainerProps> = () => {
  const { Storage } = Plugins;
  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data: any) => {
    data['category'] = category;
    data['subCategory'] = subCategory;
    console.log(data);
    fetch(host + '/creatNewPerformer', {
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

  const [category, setCategory] = useState<string>('music');
  const [subCategory, setSubCategory] = useState<string>('dj');
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState({
    count: 1,
    1: { price: 0, fraction: 0 },
  });

  return (
    <div style={{ direction: 'rtl' }}>
      <IonList>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonTitle>הוספת מופיע חדש</IonTitle>
          <IonItemGroup>
            <IonInput
              name="name"
              placeholder="שם המופיע"
              maxlength={50}
              ref={register({ required: { value: true, message: 'נדרש להוסיף שם מופיע' } })}
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
              <IonLabel>מוזיקה</IonLabel>
              <IonRadio slot="start" value="music" />
            </IonItem>

            <IonItem>
              <IonLabel>הופעה</IonLabel>
              <IonRadio slot="start" value="show" />
            </IonItem>

            <IonItem>
              <IonLabel>פרזנטציה</IonLabel>
              <IonRadio slot="start" value="presentation" />
            </IonItem>

            <IonItem>
              <IonLabel>סדנאות</IonLabel>
              <IonRadio slot="start" value="workshop" />
            </IonItem>
          </IonRadioGroup>

          <br />
          <IonTitle>תת קטגוריה</IonTitle>

          {category == 'music' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subMusicEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subMusicHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          {category == 'show' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subShowEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subShowHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          {category == 'presentation' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subPresentationEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subPresentationHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          {category == 'workshop' && (
            <IonRadioGroup value={subCategory} onIonChange={(e) => setSubCategory(e.detail.value)}>
              {subWorkshopEng.map((item, i) => {
                return (
                  <IonItem>
                    <IonLabel>{subWorkshopHeb[i]}</IonLabel>
                    <IonRadio slot="start" value={item} />
                  </IonItem>
                );
              })}
            </IonRadioGroup>
          )}
          <br />

          <IonItemDivider>קישורים</IonItemDivider>
          <div style={{ direction: 'ltr' }}>
            <IonInput placeholder="Facebook" name="facebookLink" type="url" ref={register()}></IonInput>
            <IonInput placeholder="youtube" name="youtubeLink" type="url" ref={register()}></IonInput>
            <IonInput placeholder="google" name="googleLink" type="url" ref={register()}></IonInput>
          </div>
          <br />

          <IonItemDivider>הוספת קישור לסרטון</IonItemDivider>
          <div style={{ direction: 'ltr' }}>
            <IonInput placeholder="youtube link" name="youtubeVideo" type="url" ref={register()}></IonInput>
          </div>

          <IonItemDivider>דרישות מופיע</IonItemDivider>
          <IonItemGroup>
            {/* <IonInput placeholder="כותרת"></IonInput> */}
            <IonItem>
              {/* <IonText>1.</IonText> */}
              <IonInput placeholder="סכום קבוע" type="number" name="fixPrice" ref={register()}></IonInput>
              <IonText>+</IonText>
              <IonInput placeholder="אחוז מהכנסות" type="number" name="partPrice" ref={register()}></IonInput>
            </IonItem>
            {/* <IonButton>הוסף אפשרות תשלום</IonButton> */}
            <IonInput placeholder="ציוד באחריות המופיע" name="equipmentFromPerformer" ref={register()}></IonInput>
            <IonInput placeholder="ציוד באחריות המזמין" name="equipmentFromProduction" ref={register()}></IonInput>
          </IonItemGroup>

          <IonItemDivider>הערות ומגבלות</IonItemDivider>
          <IonInput placeholder="מגבלות גיאוגרפיות" name="geographicalRestrictions" ref={register()}></IonInput>
          <IonInput placeholder="הערות" name="remarks" ref={register()}></IonInput>

          <IonButton expand="block" size="large" id="saveButton" href="Home" type="submit" color="warning">
            הוספת מופיע חדש
          </IonButton>
        </form>
      </IonList>
    </div>
  );
};

export default NewSpot;
