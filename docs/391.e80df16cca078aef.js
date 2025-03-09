"use strict";(self.webpackChunkFrontend=self.webpackChunkFrontend||[]).push([[391],{2391:(j,c,r)=>{r.r(c),r.d(c,{UserModule:()=>C});var l=r(6814),u=r(2186),d=r(8538),e=r(4946),h=r(2615),g=r(845),m=r(8784),p=r(9229),v=r(3667),f=r(2217);function U(s,a){1&s&&e._UZ(0,"app-sudo-nav")}const P=function(s){return{"mt-2":s}},S=[{path:":id",component:(()=>{class s{constructor(i,t,o,n,T,b,Z){this.router=i,this.userService=t,this.tokenService=o,this.authService=n,this.route=T,this.toastr=b,this.cacheService=Z,this.isMyPage=!1,this.token=null,this.uid=null,this.username=null,this.profilePictureUrl="assets/images/no-pfp.png",this.role=null,this.joined=null}ngOnInit(){this.route.params.subscribe(i=>{this.token=this.tokenService.getToken(),this.token||this.authService.unauthorizedHandler();const t=parseInt(this.router.url.split("/")[2]);if(!t){const n=this.tokenService.decodeToken();n?this.router.navigate(["u",n.uid]):this.authService.unauthorizedHandler()}const o=this.tokenService.decodeToken();o?(this.isMyPage=o.uid==t,this.getCompleteUserData(this.isMyPage?o.uid:t)):this.authService.unauthorizedHandler()})}createImageFromBlob(i){const t=new FileReader;t.onloadend=()=>{this.profilePictureUrl=t.result},t.readAsDataURL(i)}getCompleteUserData(i){this.userService.getUserById(i).subscribe({next:t=>{this.isMyPage?this.setMyPage(t.uid,t.username,t.joined,t.role):this.setUserPage(t.uid,t.username,t.joined,t.role)},error:t=>{switch(t.status){case 401:this.authService.unauthorizedHandler();break;case 404:this.router.navigate(["404"]);break;default:this.toastr.error("","Napaka pri pridobivanju podatkov o uporabniku",{timeOut:d.V.error})}}}),setTimeout(()=>{const t=this.cacheService.get(i.toString());t?this.createImageFromBlob(t):this.userService.getUserPfp(i).subscribe({next:o=>{this.cacheService.put(i.toString(),o),this.createImageFromBlob(o)},error:o=>{401===(this.profilePictureUrl="assets/images/no-pfp.png",o.status)&&this.authService.unauthorizedHandler()}})},500)}setMyPage(i,t,o,n){this.uid=i,this.username=t,this.role=n,this.joined=o,this.isMyPage=!0}setUserPage(i,t,o,n){this.uid=i,this.username=t,this.role=n,this.joined=o,this.isMyPage=!1}}return s.\u0275fac=function(i){return new(i||s)(e.Y36(u.F0),e.Y36(h.K),e.Y36(g.B),e.Y36(m.e),e.Y36(u.gz),e.Y36(p._W),e.Y36(v.Q))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-user-page"]],decls:16,vars:10,consts:[[4,"ngIf"],[1,"row","container-profile",3,"ngClass"],[1,"row","profile-info"],[1,"row","user-data","mb-3"],[1,"col-12","col-lg-3","img-cont"],["width","200","height","200",1,"profile-pic",3,"src","alt","title"],[1,"col-12","col-lg-9","name-cont"],[1,"username-cont"],[1,"m-0","p-0","username"],[1,"role","mt-1"],[1,"title"],[1,"value"]],template:function(i,t){1&i&&(e.YNc(0,U,1,0,"app-sudo-nav",0),e.TgZ(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4),e._UZ(5,"img",5),e.qZA(),e.TgZ(6,"div",6)(7,"div",7)(8,"h3",8),e._uU(9),e.qZA(),e.TgZ(10,"p",9),e._uU(11),e.qZA(),e.TgZ(12,"div",10),e._uU(13,"Pridru\u017eil dne"),e.qZA(),e.TgZ(14,"div",11),e._uU(15),e.qZA()()()()()()),2&i&&(e.Q6J("ngIf",t.isMyPage),e.xp6(1),e.Q6J("ngClass",e.VKq(8,P,!t.isMyPage)),e.xp6(4),e.Q6J("src",t.profilePictureUrl,e.LSH)("alt",t.username)("title",t.username),e.xp6(4),e.Oqu(t.username),e.xp6(2),e.Oqu(t.role),e.xp6(4),e.Oqu(t.joined))},dependencies:[l.mk,l.O5,f.a],styles:[".profile-pic[_ngcontent-%COMP%]{width:200px;height:200px;border-radius:var(--border-radius);margin:0 auto;display:block;object-fit:cover;background-size:cover;background-position:center;background-repeat:no-repeat}@media (max-width: 992px){.name-cont[_ngcontent-%COMP%]{margin:auto;text-align:center}}"]}),s})()}];let M=(()=>{class s{}return s.\u0275fac=function(i){return new(i||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[u.Bz.forChild(S),u.Bz]}),s})();var y=r(8524),k=r(5823);let C=(()=>{class s{}return s.\u0275fac=function(i){return new(i||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[l.ez,y.m,k.SudoModule,M]}),s})()}}]);