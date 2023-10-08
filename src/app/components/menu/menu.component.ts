import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Pizza } from 'src/app/shared/interfaces/pizza';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isAdmin: boolean
  modifying: boolean
  selectedPizza: string
  formGroup: FormGroup

  pizzas: Pizza[] = [];
  pizzasWithSauce: any[] = [];
  pizzasWithoutSauce: any[] = [];

  constructor(
    public menuService: MenuService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
    ){
      this.formGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        hasSauce: [false, [Validators.required]],
        price: ['', [Validators.required]],
        description: ['', [Validators.required]],
      });      
    }

  async ngOnInit(){
    this.modifying = false
    this.getPizzas()
    this.isAdmin = await this.authService.isAdmin()
    this.handleRouteChange()
  }

  getPizzas(){
    this.menuService.getPizzas()
      .then((pizzas) => {
        pizzas.forEach((pizzaData) => {
          const pizza: Pizza = {
            id: pizzaData.id,
            name: pizzaData.name,
            hasSauce: pizzaData.hasSauce,
            price: pizzaData.price,
            description: pizzaData.description
          } 
          this.pizzas.push(pizza)
        })
        this.pizzas.forEach(pizza => {
          if(pizza.hasSauce) this.pizzasWithSauce.push(pizza)
          else this.pizzasWithoutSauce.push(pizza)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deletePizza(){
    const childRoute = this.route.firstChild;
    if(childRoute){
      const id = childRoute.snapshot.paramMap.get('pizzaid');
      this.menuService.deletePizza(id);
    }
  }

  onSubmit(){
    if(this.formGroup.valid) {
      const name = this.formGroup.get('name')?.value
      const hasSauce = this.formGroup.get('hasSauce')?.value
      const price = this.formGroup.get('price')?.value
      const description = this.formGroup.get('description')?.value

      if(name && price && description){
        this.menuService.addPizza(name, hasSauce, price, description)
        this.modifying = false
        this.formGroup.reset()
      }
    }
  }

  handleRouteChange() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const childRoute = this.route.firstChild;
      if(childRoute){
        const id = childRoute.snapshot.paramMap.get('pizzaid');
        this.selectedPizza = this.pizzas.find(pizza => pizza.id === id).name;
      }
    });
  }

}
