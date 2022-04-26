import { Component, OnInit } from '@angular/core';
import {AddressService} from "../services/address.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  address: any;
  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
  }
  getAddress(place: any) {
    let placeAddress = this.addressService.parseAddress(place);
    console.log('address', placeAddress);
  }


}
