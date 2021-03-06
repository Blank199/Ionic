import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ItemEdit, ItemList } from './todo';

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
import { ItemProvider } from './todo/ProductProvider';
import { AuthProvider } from './Authentication/AuthProvider';
import { PrivateRoute } from './Authentication/ProvateRoute';
import { Login } from './Authentication/Login';


const App: React.FC = () => (
  <IonApp>
    <ItemProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthProvider>
            <Route path="/login" component={Login} exact={true}/>
            <ItemProvider>
              <PrivateRoute path="/products" component={ItemList} exact={true}/>
              <PrivateRoute path="/product" component={ItemEdit} exact={true}/>
              <PrivateRoute path="/products/:id" component={ItemEdit} exact={true}/>
            </ItemProvider>
            <Route exact path="/" render={() => <Redirect to="/products"/>}/>
          </AuthProvider>
        </IonRouterOutlet>
      </IonReactRouter>
    </ItemProvider>
  </IonApp>
);

export default App;
