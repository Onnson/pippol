import React, { useState }  from 'react';
import { IonButton, IonTextarea, IonItem, IonItemGroup, IonAlert } from '@ionic/react';
import { IonInput, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from "react-hook-form";
import { Plugins, App } from '@capacitor/core';
import {host, versionName} from '../App.config.json';

import './MPContainer.css';

interface ContainerProps { }

const _defaultEmergencyContacts = [{name: "", phone: "", idx: 0}];
let initted = false;
let userDetails : any;

const SetupContainer: React.FC<ContainerProps> = () => {

  const [hasSubscription, setHasSubscription] = useState(false);

  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  
  const [emergencyContacts, setEmergencyContacts] = useState(_defaultEmergencyContacts);
  const [showAlert1, setShowAlert1] = useState(false);

  const addEmergencyContact = () => {
    if (userDetails.userType < 2 && emergencyContacts.length > 0) {
      setShowAlert1(true);
      return;
    }
    if (emergencyContacts.length >= 10) {
      return;
    }
    var newcopy = JSON.parse(JSON.stringify(emergencyContacts));
    newcopy.push({name: "", phone: "", idx: newcopy.length});
    setEmergencyContacts(newcopy);
  }

  function removeEmergencyContact (idx : number) {
    if (userDetails.userType == 1) {
      return;
    }
    var newcopy = JSON.parse(JSON.stringify(emergencyContacts));
    if (idx == 0 && emergencyContacts.length == 1) {
      newcopy[0].idx = 0;
      newcopy[0].name = "";
      newcopy[0].phone = "";
    } else {
      newcopy.splice(idx, 1);
      for (let i  = 0; i < newcopy.length; i++) {
        newcopy[i].idx = i;
      }
    }
    setEmergencyContacts(newcopy);
  }
  
  function updateECName (idx : any, name : any) {
    emergencyContacts[idx].name = name;
  }
  function updateECPhone (idx : any, phone : any) {
    emergencyContacts[idx].phone = phone;
  }

  const { Storage } = Plugins;

  if (!initted) {
    initted = true;
    Storage.get({key:"userDetails"}).then((data: any) => {
      if (data.value) {
        userDetails = JSON.parse(data.value);
        setValue("name", userDetails.name);
        setValue("email", userDetails.email);
        setValue("password", userDetails.password);
        setValue("passwordrepeat", userDetails.password);
        setValue("phone", userDetails.phone);
        setValue("country", userDetails.country);
        setValue("address", userDetails.address);
        setValue("notes", userDetails.notes);
        if (userDetails.emergencyContacts.length == 0) {
          userDetails.emergencyContacts = [{name: "", phone: "", idx: 0}];
        }
        setEmergencyContacts(userDetails.emergencyContacts);
        if (!userDetails.emailConfirmed) setEmailNotConfirmed(true);
        if (userDetails && userDetails.userType > 1 && userDetails.userType < 4) {
          setHasSubscription(true);
        }
      }
    });
  }
  

  const { register, handleSubmit, watch, errors, setValue } = useForm();
  const onSubmit = (data : any) => {
    
    if (data.password != data.passwordrepeat) {
      setValue("passwordrepeat", "");
      return;
    }

    Storage.get({key:"userDetails"}).then((storageData: any) => {
      if (storageData.value) {
        userDetails = JSON.parse(storageData.value);
        userDetails.name = data.name;
        userDetails.email = data.email;
        userDetails.password = data.password;
        userDetails.phone = data.phone;
        userDetails.country = data.country;
        userDetails.address = data.address;
        userDetails.notes = data.notes;
        userDetails.emergencyContacts = emergencyContacts;
        const userDetailsStringified = JSON.stringify(userDetails);
        Storage.set({key:"userDetails", value: userDetailsStringified});

        fetch(host + "/setup", {
          method: 'POST', headers: {
            'Content-Type': 'application/json'}, body: userDetailsStringified})
            .then(res => res.json())
            .then(
              (result) => {
                if (result.status == "success") {
                  showStatus("Update successful.");
                  document.location.href = "/Home";
                } else {
                showStatus("Update failed.");
                }
              },
              (error) => {
                console.log("error: " + error);
                showStatus("Update failed.");
              }
            );
            // -fetch
      }
    });

    

  };
  
  function showStatus (txt : string) {
    var statusLabel = document.getElementById("statusLabel");
    if (statusLabel) {
      statusLabel.classList.remove("displayNone");
      statusLabel.innerText = txt;
    }
  }

  const resendEmailConfirmation = () => {
    fetch(host + "/resendEmailConfirmation", {
      method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify({token: userDetails.login.token})})
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status == "success") {
              setEmailNotConfirmed(false);
            }
          },
          (error) => {
            console.log("error: " + error);
          }
        );
        // -fetch
  }


  return (
    <div className="mpcontainer">
     
      <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          // header={'Premium feature'}
          // subHeader={'Add more emergency contacts'}
          message={'Upgrade to Premium subscription to add up to 10 emergency contacts.'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Upgrade',
              handler: () => {
                console.log('Confirm Okay');
                document.location.href = '/subscription';
              }
            }
          ]}/>
     <form onSubmit={handleSubmit(onSubmit)}>
     <IonLabel color="warning">Name: </IonLabel>
      <IonInput name="name" placeholder="Name" maxlength={50} ref={register({ required: true, pattern: {value: /^[A-Za-z ]+$/i, message: 'Only letters are allowed.'} })} />
      <IonLabel color="warning">{errors.name && errors.name.message}</IonLabel>
      <br/>
      <IonLabel color="warning">Email</IonLabel>
      <IonInput name="email" id="email" placeholder="Email" type="email" maxlength={50} ref={register({ required: true, pattern: {value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, message: 'Email not valid.'} })} onIonChange={()=>{setEmailNotConfirmed(false);}} />
      <IonLabel color="warning">{errors.email && errors.email.message}</IonLabel>
      {emailNotConfirmed? (
        <div>
          <IonButton id="resendEmailConfirmation" color="warning" onClick={resendEmailConfirmation}>Resend email confirmation link</IonButton>
        </div>
      ):(
        ""
      )}
      <br/>
      <IonLabel color="warning">Password</IonLabel>
      <IonInput name="password" type="password" placeholder="Change password" maxlength={20} ref={register({ required: {value: true, message: 'Password is required'}, minLength: {value: 6, message: 'Password too short.'} })} />
      <IonLabel color="warning">{errors.password && errors.password.message}</IonLabel>
      <br/>
      <IonLabel color="warning">Retype password</IonLabel>
      <IonInput name="passwordrepeat" type="password" placeholder="Repeat password" ref={register({ required: true})} />
      <IonLabel color="warning">{errors.passwordrepeat && "Please repeat password"}</IonLabel>
      <br/>
      <IonLabel color="warning">Phone</IonLabel>
      <IonInput name="phone" placeholder="Phone" type="tel" maxlength={50} ref={register({ required: {value: true, message: 'Phone is required'}, minLength: {value: 7, message: 'Phone too short'}, pattern: {value: /^[0-9\+\- ]+$/, message: 'Only numbers are allowed.'} })} />
      <IonLabel color="warning">{errors.phone && errors.phone.message}</IonLabel>
      {/* <br/> */}
      {/* <CountryDropdown
          value={country}
          onChange={(val) => setCountry(val)}  /><br/><br/> */}
      <br/>
      <IonLabel color="warning">Country</IonLabel>
      {/* <IonSelect className="IonSelect" value={country} okText="Okay" cancelText="Dismiss" onIonChange={e => setCountry(e.detail.value)}> */}
      <IonSelect interface="action-sheet" className="IonSelect" name="country" okText="Okay" cancelText="Dismiss" ref={register({ required: true})} >
        <IonSelectOption value="Afghanistan-93">Afghanistan</IonSelectOption><IonSelectOption value="Albania-355">Albania</IonSelectOption><IonSelectOption value="Algeria-213">Algeria</IonSelectOption><IonSelectOption value="American Samoa-1684">American Samoa</IonSelectOption><IonSelectOption value="Andorra-376">Andorra</IonSelectOption><IonSelectOption value="Angola-244">Angola</IonSelectOption><IonSelectOption value="Anguilla-1264">Anguilla</IonSelectOption><IonSelectOption value="Antigua and Barbuda-1268">Antigua and Barbuda</IonSelectOption><IonSelectOption value="Argentina-54">Argentina</IonSelectOption><IonSelectOption value="Armenia-374">Armenia</IonSelectOption><IonSelectOption value="Aruba-297">Aruba</IonSelectOption><IonSelectOption value="Australia-61">Australia</IonSelectOption><IonSelectOption value="Austria-43">Austria</IonSelectOption><IonSelectOption value="Azerbaijan-994">Azerbaijan</IonSelectOption><IonSelectOption value="Bahamas-1242">Bahamas</IonSelectOption><IonSelectOption value="Bahrain-973">Bahrain</IonSelectOption><IonSelectOption value="Bangladesh-880">Bangladesh</IonSelectOption><IonSelectOption value="Barbados-1246">Barbados</IonSelectOption><IonSelectOption value="Belarus-375">Belarus</IonSelectOption><IonSelectOption value="Belgium-32">Belgium</IonSelectOption><IonSelectOption value="Belize-501">Belize</IonSelectOption><IonSelectOption value="Benin-229">Benin</IonSelectOption><IonSelectOption value="Bermuda-1441">Bermuda</IonSelectOption><IonSelectOption value="Bhutan-975">Bhutan</IonSelectOption><IonSelectOption value="Bolivia-591">Bolivia</IonSelectOption><IonSelectOption value="Bosnia and Herzegovina-387">Bosnia and Herzegovina</IonSelectOption><IonSelectOption value="Botswana-267">Botswana</IonSelectOption><IonSelectOption value="Brazil-55">Brazil</IonSelectOption><IonSelectOption value="Brunei Darussalam-673">Brunei Darussalam</IonSelectOption><IonSelectOption value="Bulgaria-359">Bulgaria</IonSelectOption><IonSelectOption value="Burkina Faso-226">Burkina Faso</IonSelectOption><IonSelectOption value="Burundi-257">Burundi</IonSelectOption><IonSelectOption value="Cambodia-855">Cambodia</IonSelectOption><IonSelectOption value="Cameroon-237">Cameroon</IonSelectOption><IonSelectOption value="Canada-1">Canada</IonSelectOption><IonSelectOption value="Cape Verde-238">Cape Verde</IonSelectOption><IonSelectOption value="Cayman Islands-1345">Cayman Islands</IonSelectOption><IonSelectOption value="Central African Republic-236">Central African Republic</IonSelectOption><IonSelectOption value="Chad-235">Chad</IonSelectOption><IonSelectOption value="Chile-56">Chile</IonSelectOption><IonSelectOption value="China-86">China</IonSelectOption><IonSelectOption value="Christmas Island-618">Christmas Island</IonSelectOption><IonSelectOption value="Cocos Islands-618">Cocos Islands</IonSelectOption><IonSelectOption value="Colombia-57">Colombia</IonSelectOption><IonSelectOption value="Comoros-269">Comoros</IonSelectOption><IonSelectOption value="Congo -242">Congo </IonSelectOption><IonSelectOption value="Congo-243">Congo</IonSelectOption><IonSelectOption value="Cook Islands-682">Cook Islands</IonSelectOption><IonSelectOption value="Costa Rica-506">Costa Rica</IonSelectOption><IonSelectOption value="Côte D'Ivoire (Ivory Coast)-225">Côte D'Ivoire (Ivory Coast)</IonSelectOption><IonSelectOption value="Croatia-385">Croatia</IonSelectOption><IonSelectOption value="Cuba-53">Cuba</IonSelectOption><IonSelectOption value="Cyprus-357">Cyprus</IonSelectOption><IonSelectOption value="Czech Republic-420">Czech Republic</IonSelectOption><IonSelectOption value="Denmark-45">Denmark</IonSelectOption><IonSelectOption value="Djibouti-253">Djibouti</IonSelectOption><IonSelectOption value="Dominica-1767">Dominica</IonSelectOption><IonSelectOption value="Dominican Republic-1809">Dominican Republic</IonSelectOption><IonSelectOption value="Ecuador-593">Ecuador</IonSelectOption><IonSelectOption value="Egypt-20">Egypt</IonSelectOption><IonSelectOption value="El Salvador-503">El Salvador</IonSelectOption><IonSelectOption value="Equatorial Guinea-240">Equatorial Guinea</IonSelectOption><IonSelectOption value="Eritrea-291">Eritrea</IonSelectOption><IonSelectOption value="Estonia-372">Estonia</IonSelectOption><IonSelectOption value="Ethiopia-251">Ethiopia</IonSelectOption><IonSelectOption value="Falkland Islands -500">Falkland Islands </IonSelectOption><IonSelectOption value="Faroe Islands-298">Faroe Islands</IonSelectOption><IonSelectOption value="Fiji-679">Fiji</IonSelectOption><IonSelectOption value="Finland-358">Finland</IonSelectOption><IonSelectOption value="France-33">France</IonSelectOption><IonSelectOption value="French Guiana-594">French Guiana</IonSelectOption><IonSelectOption value="French Polynesia-689">French Polynesia</IonSelectOption><IonSelectOption value="Gabon-241">Gabon</IonSelectOption><IonSelectOption value="Gambia-220">Gambia</IonSelectOption><IonSelectOption value="Georgia-995">Georgia</IonSelectOption><IonSelectOption value="Germany-49">Germany</IonSelectOption><IonSelectOption value="Ghana-233">Ghana</IonSelectOption><IonSelectOption value="Gibraltar-350">Gibraltar</IonSelectOption><IonSelectOption value="Greece-30">Greece</IonSelectOption><IonSelectOption value="Greenland-299">Greenland</IonSelectOption><IonSelectOption value="Grenada-1473">Grenada</IonSelectOption><IonSelectOption value="Guadeloupe-590">Guadeloupe</IonSelectOption><IonSelectOption value="Guam-1671">Guam</IonSelectOption><IonSelectOption value="Guatemala-502">Guatemala</IonSelectOption><IonSelectOption value="Guinea-224">Guinea</IonSelectOption><IonSelectOption value="Guinea-Bissau-245">Guinea-Bissau</IonSelectOption><IonSelectOption value="Guyana-592">Guyana</IonSelectOption><IonSelectOption value="Haiti-509">Haiti</IonSelectOption><IonSelectOption value="Holy See (Vatican City State)-379">Holy See (Vatican City State)</IonSelectOption><IonSelectOption value="Honduras-504">Honduras</IonSelectOption><IonSelectOption value="Hong Kong, SAR-852">Hong Kong, SAR</IonSelectOption><IonSelectOption value="Hungary-36">Hungary</IonSelectOption><IonSelectOption value="Iceland-354">Iceland</IonSelectOption><IonSelectOption value="India-91">India</IonSelectOption><IonSelectOption value="Indonesia-62">Indonesia</IonSelectOption><IonSelectOption value="Iran, Islamic Republic of-98">Iran, Islamic Republic of</IonSelectOption><IonSelectOption value="Iraq-964">Iraq</IonSelectOption><IonSelectOption value="Ireland-353">Ireland</IonSelectOption><IonSelectOption value="Israel-972">Israel</IonSelectOption><IonSelectOption value="Italy-39">Italy</IonSelectOption><IonSelectOption value="Jamaica-1876">Jamaica</IonSelectOption><IonSelectOption value="Japan-81">Japan</IonSelectOption><IonSelectOption value="Jordan-962">Jordan</IonSelectOption><IonSelectOption value="Kazakhstan	76, or-7">Kazakhstan	76, or</IonSelectOption><IonSelectOption value="Kenya-254">Kenya</IonSelectOption><IonSelectOption value="Kiribati-686">Kiribati</IonSelectOption><IonSelectOption value="Korea, Democratic People's Republic of-850">Korea, Democratic People's Republic of</IonSelectOption><IonSelectOption value="Korea, Republic of-82">Korea, Republic of</IonSelectOption><IonSelectOption value="Kuwait-965">Kuwait</IonSelectOption><IonSelectOption value="Kyrgyzstan-996">Kyrgyzstan</IonSelectOption><IonSelectOption value="Laos (Lao PDR)-856">Laos (Lao PDR)</IonSelectOption><IonSelectOption value="Latvia-371">Latvia</IonSelectOption><IonSelectOption value="Lebanon-961">Lebanon</IonSelectOption><IonSelectOption value="Lesotho-266">Lesotho</IonSelectOption><IonSelectOption value="Liberia-231">Liberia</IonSelectOption><IonSelectOption value="Libya-218">Libya</IonSelectOption><IonSelectOption value="Liechtenstein-423">Liechtenstein</IonSelectOption><IonSelectOption value="Lithuania-370">Lithuania</IonSelectOption><IonSelectOption value="Luxembourg-352">Luxembourg</IonSelectOption><IonSelectOption value="Macao (SAR China)-853">Macao (SAR China)</IonSelectOption><IonSelectOption value="Macedonia, Republic of-389">Macedonia, Republic of</IonSelectOption><IonSelectOption value="Madagascar-261">Madagascar</IonSelectOption><IonSelectOption value="Malawi-265">Malawi</IonSelectOption><IonSelectOption value="Malaysia-60">Malaysia</IonSelectOption><IonSelectOption value="Maldives-960">Maldives</IonSelectOption><IonSelectOption value="Mali-223">Mali</IonSelectOption><IonSelectOption value="Malta-356">Malta</IonSelectOption><IonSelectOption value="Marshall Islands-692">Marshall Islands</IonSelectOption><IonSelectOption value="Martinique-596">Martinique</IonSelectOption><IonSelectOption value="Mauritania-222">Mauritania</IonSelectOption><IonSelectOption value="Mauritius-230">Mauritius</IonSelectOption><IonSelectOption value="Mayotte-262">Mayotte</IonSelectOption><IonSelectOption value="Mexico-52">Mexico</IonSelectOption><IonSelectOption value="Micronesia, Federated States of-691">Micronesia, Federated States of</IonSelectOption><IonSelectOption value="Moldova-373">Moldova</IonSelectOption><IonSelectOption value="Monaco-377">Monaco</IonSelectOption><IonSelectOption value="Mongolia-976">Mongolia</IonSelectOption><IonSelectOption value="Montenegro-382">Montenegro</IonSelectOption><IonSelectOption value="Montserrat-1664">Montserrat</IonSelectOption><IonSelectOption value="Morocco and Western Sahara-212">Morocco and Western Sahara</IonSelectOption><IonSelectOption value="Mozambique-258">Mozambique</IonSelectOption><IonSelectOption value="Myanmar-95">Myanmar</IonSelectOption><IonSelectOption value="Namibia-264">Namibia</IonSelectOption><IonSelectOption value="Nauru-674">Nauru</IonSelectOption><IonSelectOption value="Nepal-977">Nepal</IonSelectOption><IonSelectOption value="Netherlands-31">Netherlands</IonSelectOption><IonSelectOption value="Netherlands Antilles-599">Netherlands Antilles</IonSelectOption><IonSelectOption value="New Caledonia-687">New Caledonia</IonSelectOption><IonSelectOption value="New Zealand-64">New Zealand</IonSelectOption><IonSelectOption value="Nicaragua-505">Nicaragua</IonSelectOption><IonSelectOption value="Niger-227">Niger</IonSelectOption><IonSelectOption value="Nigeria-234">Nigeria</IonSelectOption><IonSelectOption value="Niue-683">Niue</IonSelectOption><IonSelectOption value="Norfolk Island-672">Norfolk Island</IonSelectOption><IonSelectOption value="Northern Mariana Islands-1670">Northern Mariana Islands</IonSelectOption><IonSelectOption value="Norway-47">Norway</IonSelectOption><IonSelectOption value="Oman-968">Oman</IonSelectOption><IonSelectOption value="Pakistan-92">Pakistan</IonSelectOption><IonSelectOption value="Palau-680">Palau</IonSelectOption><IonSelectOption value="Palestinian Territory, Occupied-970">Palestinian Territory, Occupied</IonSelectOption><IonSelectOption value="Panama-507">Panama</IonSelectOption><IonSelectOption value="Papua New Guinea-675">Papua New Guinea</IonSelectOption><IonSelectOption value="Paraguay-595">Paraguay</IonSelectOption><IonSelectOption value="Peru-51">Peru</IonSelectOption><IonSelectOption value="Philippines-63">Philippines</IonSelectOption><IonSelectOption value="Pitcairn-870">Pitcairn</IonSelectOption><IonSelectOption value="Poland-48">Poland</IonSelectOption><IonSelectOption value="Portugal-351">Portugal</IonSelectOption><IonSelectOption value="Puerto Rico	1787, or-939">Puerto Rico	1787, or</IonSelectOption><IonSelectOption value="Qatar-974">Qatar</IonSelectOption><IonSelectOption value="Réunion and Mayotte-262">Réunion and Mayotte</IonSelectOption><IonSelectOption value="Romania-40">Romania</IonSelectOption><IonSelectOption value="Russian Federation-7">Russian Federation</IonSelectOption><IonSelectOption value="Rwanda-250">Rwanda</IonSelectOption><IonSelectOption value="Saint Helena and also Tristan Da Cunha-290">Saint Helena and also Tristan Da Cunha</IonSelectOption><IonSelectOption value="Saint Kitts and Nevis-1869">Saint Kitts and Nevis</IonSelectOption><IonSelectOption value="Saint Lucia-1758">Saint Lucia</IonSelectOption><IonSelectOption value="Saint Pierre and Miquelon-508">Saint Pierre and Miquelon</IonSelectOption><IonSelectOption value="Saint Vincent and the Grenadines-1784">Saint Vincent and the Grenadines</IonSelectOption><IonSelectOption value="Samoa-685">Samoa</IonSelectOption><IonSelectOption value="San Marino-378">San Marino</IonSelectOption><IonSelectOption value="São Tomé and Principe-239">São Tomé and Principe</IonSelectOption><IonSelectOption value="Saudi Arabia-966">Saudi Arabia</IonSelectOption><IonSelectOption value="Senegal-221">Senegal</IonSelectOption><IonSelectOption value="Serbia-381">Serbia</IonSelectOption><IonSelectOption value="Seychelles-248">Seychelles</IonSelectOption><IonSelectOption value="Sierra Leone-232">Sierra Leone</IonSelectOption><IonSelectOption value="Singapore-65">Singapore</IonSelectOption><IonSelectOption value="Slovakia-421">Slovakia</IonSelectOption><IonSelectOption value="Slovenia-386">Slovenia</IonSelectOption><IonSelectOption value="Solomon Islands-677">Solomon Islands</IonSelectOption><IonSelectOption value="Somalia-252">Somalia</IonSelectOption><IonSelectOption value="South Africa-27">South Africa</IonSelectOption><IonSelectOption value="Spain-34">Spain</IonSelectOption><IonSelectOption value="Sri Lanka-94">Sri Lanka</IonSelectOption><IonSelectOption value="Sudan-249">Sudan</IonSelectOption><IonSelectOption value="Suriname-597">Suriname</IonSelectOption><IonSelectOption value="Svalbard and Jan Mayen Islands-47">Svalbard and Jan Mayen Islands</IonSelectOption><IonSelectOption value="Swaziland-268">Swaziland</IonSelectOption><IonSelectOption value="Sweden-46">Sweden</IonSelectOption><IonSelectOption value="Switzerland-41">Switzerland</IonSelectOption><IonSelectOption value="Syrian Arab Republic-963">Syrian Arab Republic</IonSelectOption><IonSelectOption value="Taiwan, Republic of China-886">Taiwan, Republic of China</IonSelectOption><IonSelectOption value="Tajikistan-992">Tajikistan</IonSelectOption><IonSelectOption value="Tanzania, United Republic of-255">Tanzania, United Republic of</IonSelectOption><IonSelectOption value="Thailand-66">Thailand</IonSelectOption><IonSelectOption value="Timor-Leste-670">Timor-Leste</IonSelectOption><IonSelectOption value="Togo-228">Togo</IonSelectOption><IonSelectOption value="Tokelau-690">Tokelau</IonSelectOption><IonSelectOption value="Tonga-676">Tonga</IonSelectOption><IonSelectOption value="Trinidad and Tobago-1868">Trinidad and Tobago</IonSelectOption><IonSelectOption value="Tunisia-216">Tunisia</IonSelectOption><IonSelectOption value="Turkey-90">Turkey</IonSelectOption><IonSelectOption value="Turkmenistan-993">Turkmenistan</IonSelectOption><IonSelectOption value="Turks and Caicos Islands-1649">Turks and Caicos Islands</IonSelectOption><IonSelectOption value="Tuvalu-688">Tuvalu</IonSelectOption><IonSelectOption value="Uganda-256">Uganda</IonSelectOption><IonSelectOption value="Ukraine-380">Ukraine</IonSelectOption><IonSelectOption value="United Arab Emirates-971">United Arab Emirates</IonSelectOption><IonSelectOption value="United Kingdom-44">United Kingdom</IonSelectOption><IonSelectOption value="United States of America-1">United States of America</IonSelectOption><IonSelectOption value="Uruguay-598">Uruguay</IonSelectOption><IonSelectOption value="Uzbekistan-998">Uzbekistan</IonSelectOption><IonSelectOption value="Vanuatu-678">Vanuatu</IonSelectOption><IonSelectOption value="Venezuela (Bolivarian Republic of)-58">Venezuela (Bolivarian Republic of)</IonSelectOption><IonSelectOption value="Viet Nam-84">Viet Nam</IonSelectOption><IonSelectOption value="Virgin Islands, British-1284">Virgin Islands, British</IonSelectOption><IonSelectOption value="Virgin Islands, US-1340">Virgin Islands, US</IonSelectOption><IonSelectOption value="Wallis and Futuna Islands -681">Wallis and Futuna Islands </IonSelectOption><IonSelectOption value="Yemen-967">Yemen</IonSelectOption><IonSelectOption value="Zambia-260">Zambia</IonSelectOption><IonSelectOption value="Zimbabwe-263">Zimbabwe</IonSelectOption>
      </IonSelect>
      <IonLabel color="warning">{errors.country && "Please select a country"}</IonLabel>
      <br/>
      <IonLabel color="medium">Address</IonLabel>
      <IonTextarea rows={3} name="address" placeholder="Home Address" maxlength={300} ref={register()}></IonTextarea>
      <br/>
      <IonLabel color="medium">Notes</IonLabel>
      <IonTextarea rows={3} name="notes" placeholder="Notes" maxlength={500} ref={register()}></IonTextarea>
      
      <br/><br/>
      <IonLabel color="warning">Emergency contacts</IonLabel>
      <br/><br/>
      <IonLabel color="medium" className="smallLabel leftalign">These contacts will receive an SMS message in case you're in an emergency. 
      <br/><br/>
      Upgrade to a <a href="/subscription" className="warn">Premium Subscription</a> to add up to 10 emergency contacts, or to a <a href="/subscription" className="warn">Gold Subscription</a> if you want us to contact your local emergency services in case you're in trouble and follow through until you're safe.
      </IonLabel>
      <br/><br/><br/><br/><br/><br/><br/>
      {emergencyContacts.map(con => 
      <IonItemGroup><IonItem key={"ec" + con.idx}>
      <IonInput maxlength={50} placeholder="Name" onIonChange={(e)=>updateECName(con.idx, (e.target as HTMLInputElement).value)} value={emergencyContacts[con.idx].name}></IonInput> 
      <IonInput maxlength={50} placeholder="Phone" type="tel" onIonChange={(e)=>updateECPhone(con.idx, (e.target as HTMLInputElement).value)} value={emergencyContacts[con.idx].phone}></IonInput>
            <IonButton onClick={()=>removeEmergencyContact(con.idx)} color="warning">X</IonButton>
      </IonItem>
      </IonItemGroup>
      )}
      <br/>
      <IonButton onClick={() => {addEmergencyContact();}} color="warning" fill="clear">[ Add emergency contact ]</IonButton>
      <br/><br/>
      <IonLabel id="statusLabel" color="primary" className="displayNone">---</IonLabel><br/>
      <IonButton size="large" id="cancelButton" fill="outline" href="Home" color="warning">Cancel</IonButton>
      
      <IonButton size="large" id="saveButton" href="Home" type="submit" color="warning">Save</IonButton>
      <br></br><br></br>
      <IonButton color="warning" href="signout" fill="clear">Sign out</IonButton>
        <IonButton color="warning" href="https://www.pippol.app/support" target="_blank" fill="clear">Support</IonButton>
        {/* {(hasSubscription)? ( */}
      <IonButton id="cancelSubButton" color="warning" fill="clear" href="/subscription">Subscription</IonButton>
      {/* ):""} */}
      <br/><br/>
      <IonLabel color="medium">SOS Box version {versionName}</IonLabel>
      <br/><br/>
      </form>
    </div>
    
  );
};


export default SetupContainer;
