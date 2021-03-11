import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import {
  ActionSheetController,
  NavController,
  NavParams,
  Platform,
  ToastController,
} from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { DeviceProvider } from '../../providers/device/device';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { ImageUploadProvider } from '../../providers/image-upload/image-upload';
import { ProfileProvider } from '../../providers/profile/profile';
 

@PageTrack()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  private profileFormGroup: FormGroup;
  countries : any;
  interests : any;
  cities: any;
  image : any;
  imagePath: any;
  public base64Image: string;
  plataformName: string = 'mobileweb';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileProvider: ProfileProvider,
    public alertCtrl: I18nAlertProvider,
    public fb: FormBuilder,
    public deviceStatus: DeviceProvider,
    public imageUploadProvider: ImageUploadProvider,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public platform: Platform,
    public storage: Storage,
    public toastCtrl: ToastController,
    
  ) {
   
    this.profileFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      profession: ['', Validators.required],
      city: ['', Validators.required],
      interest:[''],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      aboutme: [''],
    });

   this.imagePath = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png";
   
   platform.ready().then(() => {

    if (this.platform.is('android')) {
      this.plataformName = "android";
    }
    if (this.platform.is('ios')) {
        console.log("running on iOS device!");
    }
    if (this.platform.is('mobileweb')) {
        console.log("running in a browser on mobile!");
    }
  });
  }


  ngOnInit(){
   
    this.profileProvider.getAllCountry().subscribe((res: any) =>{
      this.countries = res;
    });
    
    this.profileProvider.getCities().subscribe((res: any) =>{
      this.cities = res;
    });

    this.profileProvider.getIntrests().subscribe((res: any) =>{
      this.interests = res;
    });

    
    this.profileProvider.getUserProfile().subscribe((res: any)=>{
      this.profileFormGroup.setValue({
        firstName: res.first_name, 
        lastName: res.last_name,
        aboutme: res.about_me,
        city: res.city,
        country: res.country,
        mobile: res.mobile,
        profession: res.profession,
        interest: res.interest
      });
    });
  }

  save(){
    if(this.profileFormGroup.valid ){
    const data = this.profileFormGroup.value;

      this.profileProvider.saveProfile({
        "bio": "about ",
        "first_name": data['firstName'],
        "last_name": data['lastName'],
        "city": data['city'],
        "country": data['country'],
        "profession": data['profession'],
        "disclose_location": false,
        "latitude": 9.85384,
        "longitude": 11.90000,
        "stripe_id": "85783458353",
        "mobile": data['mobile'].toString(),
        "about_me": data['aboutme'],
        "interest": data['interest'],
        "is_public": false,
        "profile_photo": this.image
       }).subscribe(res => {
        this.profileFormGroup.setValue({
          firstName: res.first_name, 
          lastName: res.last_name,
          aboutme: res.about_me,
          city: res.city,
          country: res.country,
          mobile: res.mobile,
          profession: res.profession,
          interest: res.interest
        });
         alert("Profile Updated Succesfully");
         this.image = null;
       })
    }
    else{
      alert("Please Fill The details");
    }
  }

   
  imagePickerForBrowser(event:any)
  {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagePath = reader.result;
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('files[]',file);
      this.image = formData;
  }
}

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
           this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }); 
    actionSheet.present();
  } 

  takePicture(source){
    this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        sourceType: source
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        console.log(this.base64Image);
    }, (err) => {
        console.log(err);
    });
  }
 
}
