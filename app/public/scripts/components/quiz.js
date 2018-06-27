"use strict";

const quiz = {
  template: `
  <div class="quiz slide" id="slideItem" ng-swipe-left="$ctrl.swipeLeft();" ng-swipe-right="$ctrl.swipeRight();">
    <form ng-show="$ctrl.hide" ng-submit="$ctrl.addUser($ctrl.newUser)">
    <img src="../../styles/full-logo.png" class="start-logo">
    <p class="pokeBox textContainer">We're about to find the first member of your squad, but I'll need to ask you some questions to find your perfect match!</p>
      <h3>Enter a Trainer name..</h3>
      <input class="invalid trainer-name" type="text" placeholder="Ash Ketchum" ng-blur="$ctrl.checkUsername($ctrl.newUser.username);" ng-model="$ctrl.newUser.username">
      <h3>Enter your Birth Month</h3>

      <div>
        <select id='gMonth2' ng-model="$ctrl.newUser.dob">
          <option value='' disabled>--Select Month--</option>
          <option value='1'>Janaury</option>
          <option value='2'>February</option>
          <option value='3'>March</option>
          <option value='4'>April</option>
          <option value='5'>May</option>
          <option value='6'>June</option>
          <option value='7'>July</option>
          <option value='8'>August</option>
          <option value='9'>September</option>
          <option value='10'>October</option>
          <option value='11'>November</option>
          <option value='12'>December</option>
        </select> 
      </div>
      <button class="animated pulse" ng-disabled="$ctrl.disabled">Submit</button>
    </form>
    <form ng-show="$ctrl.show" class="multichoice" name="questionForm" ng-submit="$ctrl.submitData($ctrl.answers)"> <!-- submit the checked answers -->
      <img class="start-logo" src="styles/logo-400.png" alt="PokeSquad logo">
      <h3> {{ $ctrl.quizarr[$ctrl.counter].question }}</h3>
      <div class="answers">
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_1_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}" clicked> {{$ctrl.quizarr[$ctrl.counter].answer_1}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_2_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_2}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_3_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_3}}
        <span class="radio"></span>
        </label>
        <label>
        <input type="radio" ng-model="$ctrl.answers" ng-value="$ctrl.quizarr[$ctrl.counter].answer_4_value" name="{{$ctrl.quizarr[$ctrl.counter].id}}"> {{$ctrl.quizarr[$ctrl.counter].answer_4}}
        <span class="radio"></span>
        </label>
      </div>

      
     </section>
      <button class="animated pulse">Submit</button>
    </form>
  </div>
  `,

  controller: ["quizService", "TrainerService", "PokemonService", "$location", function(quizService, TrainerService, PokemonService, $location) {
    const vm = this;
    vm.quizarr = [];
    vm.counter = 0;
    vm.answersRCool = [];
    vm.answers="";
    vm.show = false;
    vm.hide = true;
    vm.kind = 0;
    vm.char = 0;
    vm.orig = 0;
    vm.cool = 0;
    vm.adv = 0;
    vm.username = "";
    vm.dob = "";
    vm.trainer = {};
    vm.allTrainers = [];
    vm.disabled = false;

    PokemonService.addTrainer(null);
    
    quizService.getQuiz().then((response) => {
      vm.quizarr = response.data;
    });

    TrainerService.getTrainers().then((response) => {
      vm.allTrainers = response.data;
    });

    // checks window width on load to possibly remove class slide
    if (window.innerWidth >= 400) {
      console.log("work damnit");
      $("#slideItem").removeClass("slide");

    }

    // swipe right and left directive function
    vm.swipeRight = () => {
      if($("#slideItem").hasClass("slide") == true){
        if(vm.username == ""){
          vm.addUser(vm.newUser);
          console.log("add user");
        }
        if(vm.username !== ""){
          vm.submitData();
          console.log("submitData");
        };
      } 
    };
    vm.swipeLeft = () => {
      if($("#slideItem").hasClass("slide") == true){
        vm.submitData();
        console.log("left");
      }
    }
    // end swipe directive functions

    vm.addUser = (newUser) => {
      vm.username = newUser.username;
      vm.dob = newUser.dob;
      vm.show = true;
      vm.hide = false;
    }
    
    vm.checkUsername = (username) => {
      for (let i = 0; i < vm.allTrainers.length; i++) {
        if (vm.allTrainers[i].username === vm.newUser.username) {
          console.log("Pick a new username..");
          vm.disabled=true;
          break;
          // change border of input to red & make submit button not clickable
        } else {
          console.log("valid username");
          vm.disabled=false;
        }
      }
    }

    vm.submitData = () => {
      vm.counter++
      switch(vm.answers){
        case "cool":
        vm.cool++;
        break;
        case "kind":
        vm.kind++;
        break;
        case "adventurous":
        vm.adv++;
        break;
        case "charismatic":
        vm.char++;
        break;
        case "original":
        vm.orig++;
        break;
      }
      vm.answers = "";

      if(vm.counter>=10){
        if(vm.cool > vm.adv && vm.cool > vm.char && vm.cool > vm.orig && vm.cool > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "cool",
            pokemon_1: 7 
          }
          TrainerService.addUser(vm.trainer);
          $location.path('/pokedex');
        } else if(vm.adv > vm.cool && vm.adv > vm.char && vm.adv > vm.orig && vm.adv > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "adventurous",
            pokemon_1: 4  
          }
          TrainerService.addUser(vm.trainer);
          $location.path('/pokedex');
        } else if(vm.char > vm.adv && vm.char > vm.cool && vm.char > vm.orig && vm.char > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "charismatic",
            pokemon_1: 25  
          }
          TrainerService.addUser(vm.trainer);
          $location.path('/pokedex');
        } else if(vm.orig > vm.adv && vm.orig > vm.char && vm.orig > vm.cool && vm.orig > vm.kind){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "original",
            pokemon_1: 151  
          }
          TrainerService.addUser(vm.trainer);
          $location.path('/pokedex');
        } else if(vm.kind > vm.adv && vm.kind > vm.char && vm.kind > vm.orig && vm.kind > vm.cool){
          vm.trainer = {
            username: vm.newUser.username,
            quiz_result: "kind",
            pokemon_1: 1  
          }
          TrainerService.addUser(vm.trainer);
          $location.path('/pokedex');
        } else{
            if(vm.dob==1 || vm.dob==2 ||vm.dob==3){
              vm.kind++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "kind",
                pokemon_1: 1  
              }
              TrainerService.addUser(vm.trainer);
              $location.path('/pokedex');
            } else if(vm.dob==4 || vm.dob==5 ||vm.dob==6){
              vm.adv++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "adventurous",
                pokemon_1: 4  
              }
              TrainerService.addUser(vm.trainer);
              $location.path('/pokedex');
            } else if(vm.dob==7 || vm.dob==8 ||vm.dob==9){
              vm.char++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "charismatic",
                pokemon_1: 25  
              }
              TrainerService.addUser(vm.trainer);
              $location.path('/pokedex');
            } else if(vm.dob==10 || vm.dob==11 ||vm.dob==12){
              vm.cool++;
              vm.trainer = {
                username: vm.newUser.username,
                quiz_result: "cool",
                pokemon_1: 7  
              }
              TrainerService.addUser(vm.trainer);
              $location.path('/pokedex');
            };
        };
      }
      
    }
  }]

}

angular
  .module("App")
  .component("quiz", quiz);