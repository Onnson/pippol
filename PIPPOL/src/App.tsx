import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonToast, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import CreatNewPerformer from './pages/CreatNewPerformer';
import NewSpot from './pages/NewSpot';
import IMIN from './pages/ImIN';
import SETUP from './pages/Setup';
import SIGNOUT from './pages/SignOut';
import SIGNUP from './pages/SignUp';
import SIGNUPADVANCE from './pages/SignupAdvance';
import SIGNIN from './pages/SignIn';
import SUBSCRIPTION from './pages/Subscription';
import MakeEvent from './pages/MakeEvent';
import Performer from './pages/Performer';
import PerformerList from './pages/PerformerList';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ReactDOM from 'react-dom';
import { Plugins } from '@capacitor/core';

let exitbuttonPressed = 0;
let exitClickInterval: any;
var exitClickSeconds = 2,
  exitClickSecondsDef = 2;

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" component={Home} exact={true} />
        <Route path="/Performer/:id" component={Performer} exact={true} />
        <Route path="/PerformerList" component={PerformerList} exact={true} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/creatNewPerformer" component={CreatNewPerformer} exact={true} />
        <Route path="/NewSpot" component={NewSpot} exact={true} />
        <Route path="/imin" component={IMIN} exact={true} />
        <Route path="/setup" component={SETUP} exact={true} />
        <Route path="/signout" component={SIGNOUT} exact={true} />
        <Route path="/signup" component={SIGNUP} exact={true} />
        <Route path="/signup-advance" component={SIGNUPADVANCE} exact={true} />
        <Route path="/signin" component={SIGNIN} exact={true} />
        <Route path="/subscription" component={SUBSCRIPTION} exact={true} />
        <Route path="/make-event" component={MakeEvent} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

document.addEventListener('ionBackButton', (ev) => {
  ev.preventDefault();
  ev.stopImmediatePropagation();
  if (['/Setup', '/subscription'].indexOf(window.location.pathname) > -1) {
    window.location.href = '/';
  } else if (window.location.pathname != '/ImIn') {
    backPushed();
    const ttt = <IonToast isOpen={true} message="Tap back again to exit" duration={1000} />;
    var exitDiv = document.getElementById('exitDiv');
    ReactDOM.render(<IonLabel />, exitDiv);
    ReactDOM.render(ttt, exitDiv);
  }
});

const backPushed = () => {
  var now = new Date();
  if (exitbuttonPressed == 0) {
    exitbuttonPressed = Math.round(now.getTime() / 1000);
    clearInterval(exitClickInterval);
    exitClickInterval = setInterval(() => {
      if (exitClickSeconds > 0) {
      } else {
        exitClickSeconds = exitClickSecondsDef;
        exitbuttonPressed = 0;
        clearInterval(exitClickInterval);
      }
    }, 1000);
  } else if (exitbuttonPressed > Math.round(now.getTime() / 1000) - exitClickSecondsDef) {
    Plugins.App.exitApp();
  } else {
    exitbuttonPressed = 0;
    exitClickSeconds = exitClickSecondsDef;
  }
};

export default App;
