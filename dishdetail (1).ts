import {Component, Inject} from '@angular/core';
import {
  ActionSheetController, IonicPage, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {Comment} from '../../shared/comment';
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {ReservationPage} from "../reservation/reservation";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              @Inject('BaseURL') private BaseURL,
              private toastCtrl: ToastController,
              private moreActionSheet: ActionSheetController,
              public modalCtrl: ModalController,
              private favoriteservice: FavoriteProvider) {
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);

    this.recalcAvgStars();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  recalcAvgStars () {
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    this.avgstars = (total / this.numcomments).toFixed(2);
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();

  }

  openMoreActionSheet() {
    console.log('openMoreActionSheet: ');
    let actionSheet = this.moreActionSheet.create({
      // title: 'Action Sheet Title',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            console.log('Add to Favorites clicked');
            this.addToFavorites();
          }
        },
        {
          text: 'Add a Comment',
          handler: () => {
            console.log('Add a Comment clicked');
            let modal = this.modalCtrl.create(CommentPage);
            modal.onDidDismiss(data => {
              console.log('onDidDismiss');
              if(data) {
                console.log(data);
                this.dish.comments.push(data);
                this.recalcAvgStars();
              } else {
                console.log('no data ...');
              }
            });
            modal.present();
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
    })

    actionSheet.present();
  }

}
