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

const NewPerformer: React.FC<ContainerProps> = () => {
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

  const [category, setCategory] = useState<string>('music');
  const [subCategory, setSubCategory] = useState<string>('dj');
  const [showModal, setShowModal] = useState(false);

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
            <IonInput placeholder="youtube" name="youtubeChannel" type="url" ref={register()}></IonInput>
            <IonInput placeholder="google" name="googleLink" type="url" ref={register()}></IonInput>
          </div>
          <br />

          <IonItemDivider>הוספת קישור לסרטון</IonItemDivider>
          <div style={{ direction: 'ltr' }}>
            <IonInput placeholder="youtube link" name="youtubeLink1" type="url" ref={register()}></IonInput>
          </div>

          <IonButton expand="block" onClick={() => setShowModal(true)}>
            הוספת דרישות מופיע
          </IonButton>
          <IonModal isOpen={showModal} cssClass="my-custom-class">
            <div style={{ direction: 'rtl' }}>
              <IonList>
                <IonInput placeholder="כותרת"></IonInput>
                <IonInput placeholder="כותרת"></IonInput>
                <IonInput placeholder="כותרת"></IonInput>
                <IonButton onClick={() => setShowModal(false)}>הוספת אופציה</IonButton>
              </IonList>
            </div>
          </IonModal>

          <IonButton expand="block" size="large" id="saveButton" href="Home" type="submit" color="warning">
            Sign Up
          </IonButton>
        </form>
      </IonList>
    </div>
  );
};

export default NewPerformer;
