import React, { useState } from 'react';
import { IonButton, IonLabel } from '@ionic/react';
import './MPContainer.css';
import { Plugins } from '@capacitor/core';
import {host} from '../App.config.json';

interface ContainerProps { }


let interval : any;
var seconds = 120;
var secondsToWait = 120;
let imokbuttonPressed = 0;
let okClickInterval : any;
var okClickSeconds = 3, okClickSecondsDef = 3;
let initted = false;
let userDetails : any;
const callingEmergencyServices = "Calling emergency services!";

const MPContainer: React.FC<ContainerProps> = () => {

  const { Storage } = Plugins;
  const [countdown, setCountdown] = useState("...");
  const[imokbuttontext, setImokbuttontext] = useState("I'm OK!");

  clearInterval(interval);
  interval = setInterval(() => {
    if (seconds > 0) {
      if (userDetails.currentLift) {
        seconds = secondsToWait - Math.round(Math.abs(new Date().getTime() - new Date(userDetails.currentLift.timeEntered).getTime()) / 1000);
      } else {
        seconds--;
      }
      setCountdown("SOS Box server will go into\n emergency in " + (seconds).toString() + " seconds");
    } else {
      setCountdown(callingEmergencyServices);
    }
  }, 1000);

  const [helpButtonDisabled, setHelpButtonDisabled] = useState(false);
  const [helpButtonText, setHelpButtonText] = useState("SOS");
  const helpButton = () => {
    seconds = 0;
    setCountdown(callingEmergencyServices);
    fetch(host + "/help", {
      method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({email: userDetails.email, token: userDetails.login.token})})
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status == "success") {
              setBackofficeStatus(result.backofficeStatus);
              setBackofficeStatusColor("success");
              setHelpButtonText("SOS SENT")
              setHelpButtonDisabled(true);
            } else {
              console.log("server error");
              setBackofficeStatus("Server error.");
              setBackofficeStatusColor("danger");
            }
          },
          (error) => {
            console.log("error: " + error);
            setBackofficeStatus("Server unavailable.");
            setBackofficeStatusColor("danger");
          }
        );
  }

  const imokbutton = () => {
    var now = new Date();
    if (imokbuttonPressed == 0) {
      imokbuttonPressed = Math.round(now.getTime() / 1000);
      
      setImokbuttontext("Press again (" + (okClickSeconds + 1) + ")");

      clearInterval(okClickInterval);
      okClickInterval = setInterval(() => {
        if (okClickSeconds > 0) {
          setImokbuttontext("Press again (" + okClickSeconds-- + ")");
        } else {
          setImokbuttontext("I'm OK!");
          okClickSeconds = okClickSecondsDef;
          imokbuttonPressed = 0;
          clearInterval(okClickInterval);
        }
      }, 1000);
    } else if (imokbuttonPressed > (Math.round(now.getTime() / 1000)) - 3) {
      Storage.set({key:"lastScreen", value: "IMIN"});
      fetch(host + "/exitLift", {
        method: 'POST', headers: {
          'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
          .then(res => res.json())
          .then(
            (result) => {
              if (result.status == "success") {
                setBackofficeStatus(result.backofficeStatus);
                setBackofficeStatusColor("success");
              } else {
                console.log("server error");
                setBackofficeStatus("Server error.");
                setBackofficeStatusColor("danger");
              }
              document.location.href = "/Home";
            },
            (error) => {
              console.log("error: " + error);
              setBackofficeStatus("Server unavailable.");
              setBackofficeStatusColor("danger");
              document.location.href = "/Home";
            }
          );
    } else {
      imokbuttonPressed = 0;
      okClickSeconds = okClickSecondsDef;
      setImokbuttontext("I'm OK!");
    }
  }


  const[locationLabel, setLocationLabel] = useState("Location NOT set!");

  const[backofficeStatus, setBackofficeStatus] = useState("waiting for server...");
  const[backofficeStatusColor, setBackofficeStatusColor] = useState("medium");

  if (!initted) {
    initted = true;
    
    const promise1 = new Promise((resolve, reject) => {
      Storage.get({key:"LocationInput"}).then((storageDataLocationInput: any) => {
        if (storageDataLocationInput.value) {
          setLocationLabel(storageDataLocationInput.value);
        }
        resolve(storageDataLocationInput.value);
      });
    });
    const promise2 = new Promise((resolve, reject) => {
      Storage.get({key:"LocationInputCords"}).then((storageDataCords: any) => {
        let cords = {};
        if (storageDataCords.value) {
          cords = JSON.parse(storageDataCords.value);
        }
        resolve(cords);
      });
    });
    const promise3 = new Promise((resolve, reject) => {
      Storage.get({key:"userDetails"}).then((dataUserDetails: any) => {
        if (dataUserDetails.value) {
          userDetails = JSON.parse(dataUserDetails.value);
        }
        resolve(userDetails);
      });
    });
    const promise4 = new Promise((resolve, reject) => {
      Storage.get({key:"MinutesToWait"}).then((storageDataMinutesToWait: any) => {
        if (storageDataMinutesToWait.value) {
          secondsToWait = 60 * Number.parseInt(storageDataMinutesToWait.value);
          seconds = secondsToWait;
        }
        resolve(storageDataMinutesToWait.value);
      });
    });
    Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
      var locationInput = values[0];
      var cords = values[1] as any;
      userDetails = values[2] as any;
      var minutesToWait = values[3] as number;
      
      fetch(host + "/enterLift", {
        method: 'POST', headers: {
          'Content-Type': 'application/json'}, body: JSON.stringify({timeEntered: new Date(), 
            locationInput: locationInput, lat: cords.lat, lon: cords.lon, timeToExit: (new Date().getTime() + 1000 * 60 * minutesToWait), token: userDetails.login.token})})
          .then(res => res.json())
          .then(
            (result) => {
              if (result.status == "success") {
                userDetails.currentLift = result.currentLift;
                setBackofficeStatus(result.backofficeStatus);
                setBackofficeStatusColor("success");
              } else {
                console.log("server error");
                setBackofficeStatus("Server error.");
                setBackofficeStatusColor("danger");
              }
            },
            (error) => {
              console.log("error: " + error);
              setBackofficeStatus("Server unavailable.");
              setBackofficeStatusColor("danger");
            }
          );
    }).catch ((error)=> {
        console.error(error.message);
    });
  }
  return (
    <div className="mpcontainer maincontainer">
      <div className="countdownLabelDiv" id="countdownLabel">
        <IonLabel className="countdownLabel">{countdown}</IonLabel>
      </div>
      <div className="locationLabelDiv">
      <IonLabel class="locationLabel" color="medium">Your location:</IonLabel><br/>
        <IonLabel class="locationLabel" color="medium">{locationLabel}</IonLabel>
      </div>
      <br/>
      <IonButton size="large" onClick={imokbutton} id="ImOKButton" className="ImOKButton" color="success">{imokbuttontext}</IonButton>
      <br/>
      <IonButton size="large" disabled={helpButtonDisabled} onClick={helpButton} id="helpButton" color="danger">{helpButtonText}</IonButton>
      <br/>
      <div className="ImInStatus">
      <IonLabel color={backofficeStatusColor}>{backofficeStatus}</IonLabel>
      </div>
    </div>
  );
};

export default MPContainer;
