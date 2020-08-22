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

const hideEle: CSSProperties = {
  display: 'none',
};

const NewUser: React.FC<ContainerProps> = () => {
  const { Storage } = Plugins;

  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data: any) => {
    data['option'] = option;
    console.log(data);
    fetch(host + '/signup-advance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        option: data.option,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if ('exists' == result.status) {
            Storage.set({ key: 'userAlreadyExists', value: result.email });
            document.location.href = '/SignIn';
          } else if ('success' == result.status) {
            Storage.set({ key: 'userDetails', value: JSON.stringify(result.userDetails) });
            console.log(result.userDetails);
            document.location.href = '/Home';
          }
        },
        (error) => {
          //console.log("error: " + error);
          alert(error);
        }
      );
  };

  var opt: { [id: string]: boolean } = {};
  const handelChenge = (str: string, checked: boolean) => {
    let tmp = option;
    tmp[str] = checked;
    setOption(tmp);
  };

  const [option, setOption] = useState(opt);
  const [performer, setPerformer] = useState(false);
  const [spotOwner, setSpotOwner] = useState(false);
  const [helper, setHelper] = useState(false);
  const [puller, setPuller] = useState(false);

  return (
    <div className="mpcontainer maincontainer">
      <IonList>
        <form onSubmit={handleSubmit(onSubmit)}>
          <br />
          <br />
          <IonItem>
            {/* <IonLabel>Name</IonLabel> */}
            <IonInput
              name="name"
              placeholder="Name"
              maxlength={50}
              ref={register({ pattern: { value: /^[A-Za-z ]+$/i, message: 'Only letters are allowed.' } })}
            />
            <IonLabel color="warning">{errors.name && errors.name.message}</IonLabel>
            <br />
            {/* <IonLabel>Email</IonLabel> */}
            <IonInput
              name="email"
              placeholder="Email"
              type="email"
              maxlength={50}
              ref={register({
                required: { value: true, message: 'Email is required' },
                pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: 'Email not valid.' },
              })}
            />
            <IonLabel color="warning">{errors.email && errors.email.message}</IonLabel>
            <br />
            {/* <IonLabel>Password</IonLabel> */}
            <IonInput
              name="password"
              placeholder="Password"
              type="password"
              maxlength={20}
              ref={register({
                required: { value: true, message: 'Password is required' },
                minLength: { value: 6, message: 'Password too short.' },
              })}
            />
            <IonLabel color="warning">{errors.password && errors.password.message}</IonLabel>
            <br />
            {/* <IonLabel>Phone</IonLabel> */}
            <IonInput
              name="phone"
              placeholder="Phone"
              type="tel"
              maxlength={50}
              ref={register({
                minLength: { value: 7, message: 'Phone too short' },
                pattern: { value: /^[0-9\+\- ]+$/, message: 'Only numbers are allowed.' },
              })}
            />
            <IonLabel color="warning">{errors.phone && errors.phone.message}</IonLabel>
          </IonItem>

          <br />
          <br />
          <IonItemDivider>Advance User Option</IonItemDivider>
          <IonItemGroup>
            <IonItem>
              <IonLabel>Performer:</IonLabel>
              <IonToggle checked={performer} onIonChange={(e) => setPerformer(e.detail.checked)} />
            </IonItem>
            <div style={performer ? {} : { display: 'none' }}>
              <IonItemGroup>
                <IonItemDivider>Music</IonItemDivider>
                <IonItem>
                  <IonLabel>Dj</IonLabel>
                  <IonToggle
                    name="DJ"
                    onIonChange={(e) => {
                      handelChenge('Dj', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Band</IonLabel>
                  <IonToggle
                    name="Band"
                    onIonChange={(e) => {
                      handelChenge('Band', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Singer</IonLabel>
                  <IonToggle
                    name="Singer"
                    onIonChange={(e) => {
                      handelChenge('Singer', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Player</IonLabel>
                  <IonToggle
                    name="Player"
                    onIonChange={(e) => {
                      handelChenge('Player', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Show</IonItemDivider>
                <IonItem>
                  <IonLabel>Comedy</IonLabel>
                  <IonToggle
                    name="Comedy"
                    onIonChange={(e) => {
                      handelChenge('Comedy', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Play</IonLabel>
                  <IonToggle
                    name="Play"
                    onIonChange={(e) => {
                      handelChenge('Play', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Show-Other"
                    onIonChange={(e) => {
                      handelChenge('Show-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Presentation</IonItemDivider>
                <IonItem>
                  <IonLabel>Juggler</IonLabel>
                  <IonToggle
                    name="Juggler"
                    onIonChange={(e) => {
                      handelChenge('Juggler', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Moderator</IonLabel>
                  <IonToggle
                    name="Moderator"
                    onIonChange={(e) => {
                      handelChenge('Moderator', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Workshop</IonItemDivider>
                <IonItem>
                  <IonLabel>Lecture</IonLabel>
                  <IonToggle
                    name="Lecture"
                    onIonChange={(e) => {
                      handelChenge('Lecture', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Class</IonLabel>
                  <IonToggle
                    name="Lecture"
                    onIonChange={(e) => {
                      handelChenge('Lecture', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Workshop-Other"
                    onIonChange={(e) => {
                      handelChenge('Workshop-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
              </IonItemGroup>
            </div>
          </IonItemGroup>
          <br />
          <br />

          <IonItemGroup>
            <IonItem>
              <IonLabel>SpotOwner:</IonLabel>
              <IonToggle checked={spotOwner} onIonChange={(e) => setSpotOwner(e.detail.checked)} />
            </IonItem>
            <div style={spotOwner ? {} : { display: 'none' }}>
              <IonItemGroup>
                <IonItemDivider>Private</IonItemDivider>
                <IonItem>
                  <IonLabel>Roof</IonLabel>
                  <IonToggle
                    name="Roof"
                    onIonChange={(e) => {
                      handelChenge('Roof', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Yard</IonLabel>
                  <IonToggle
                    name="Yard"
                    onIonChange={(e) => {
                      handelChenge('Yard', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>House</IonLabel>
                  <IonToggle
                    name="House"
                    onIonChange={(e) => {
                      handelChenge('House', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Appartment</IonLabel>
                  <IonToggle
                    name="Appartment"
                    onIonChange={(e) => {
                      handelChenge('Appartment', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Commercial</IonItemDivider>
                <IonItem>
                  <IonLabel>Pub</IonLabel>
                  <IonToggle
                    name="Pub"
                    onIonChange={(e) => {
                      handelChenge('Pub', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Club</IonLabel>
                  <IonToggle
                    name="Club"
                    onIonChange={(e) => {
                      handelChenge('Club', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Museum</IonLabel>
                  <IonToggle
                    name="Museum"
                    onIonChange={(e) => {
                      handelChenge('Museum', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Commercial-Other"
                    onIonChange={(e) => {
                      handelChenge('Commercial-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
              </IonItemGroup>
            </div>
          </IonItemGroup>
          <br />
          <br />

          <IonItemGroup>
            <IonItem>
              <IonLabel>Helper:</IonLabel>
              <IonToggle checked={helper} onIonChange={(e) => setHelper(e.detail.checked)} />
            </IonItem>
            <div style={helper ? {} : { display: 'none' }}>
              <IonItemGroup>
                <IonItemDivider>Production and support</IonItemDivider>
                <IonItem>
                  <IonLabel>Sound</IonLabel>
                  <IonToggle
                    name="Sound"
                    onIonChange={(e) => {
                      handelChenge('Sound', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Accessories</IonLabel>
                  <IonToggle
                    name="Accessories"
                    onIonChange={(e) => {
                      handelChenge('Accessories', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Production-Other"
                    onIonChange={(e) => {
                      handelChenge('Production-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Food and beverages</IonItemDivider>
                <IonItem>
                  <IonLabel>Extras</IonLabel>
                  <IonToggle
                    name="Extras"
                    onIonChange={(e) => {
                      handelChenge('Extras', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Alcohol</IonLabel>
                  <IonToggle
                    name="Alcohol"
                    onIonChange={(e) => {
                      handelChenge('Alcohol', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Catering</IonLabel>
                  <IonToggle
                    name="Catering"
                    onIonChange={(e) => {
                      handelChenge('Catering', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Food-Other"
                    onIonChange={(e) => {
                      handelChenge('Food-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItemDivider>Promotion</IonItemDivider>
                <IonItem>
                  <IonLabel>Graphic</IonLabel>
                  <IonToggle
                    name="Graphic"
                    onIonChange={(e) => {
                      handelChenge('Graphic', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Other</IonLabel>
                  <IonToggle
                    name="Promotion-Other"
                    onIonChange={(e) => {
                      handelChenge('Promotion-Other', e.detail.checked);
                      console.log(option);
                    }}
                  />
                </IonItem>
              </IonItemGroup>
            </div>
          </IonItemGroup>
          <br />
          <br />

          <IonItem>
            <IonLabel>Puller:</IonLabel>
            <IonToggle checked={puller} onIonChange={(e) => setPuller(e.detail.checked)} />
          </IonItem>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <IonButton size="large" id="saveButton" href="Home" type="submit" color="warning">
            Sign Up
          </IonButton>
          <br></br>
          <br></br>
          <IonButton href="signin" color="warning" fill="clear">
            Sign in
          </IonButton>

          <br />
          <br />
        </form>
      </IonList>
    </div>
  );
};

export default NewUser;
