use <surf_of_revolution.scad>
use <fillet-demo.scad>
sf=1/2.5;
bigR=20;
minkR=0;
//$fn=32;
smallR=(bigR+minkR)*sf;
n=24;
ff=1.8; // fattening factor
tf=.6;  // thinnening factor
cr=[ for (i=[0:360/n:360-.001]) bigR*[tf*cos(i),ff*sin(i),0] ];

//rotate([90,0,180]) 
//spin(cr,bigR/sf,180,sf,45,20);
//rotate([-90,0,180]) spin(cr, bigR/sf, 180, sf, 20);

module HornLink3(k, th=45, extr=0) {
    if (k>0) {
        s = (k==1) ? 0 : 1; 
        translate([0,0,0]) scale([1.2*tf, ff, ff]) rotate([90,0,0]) sphere(1.1*bigR);
        rotate([90,0,180]) 
             translate([-bigR/sf,0,0])
                  spin(cr, bigR/sf, 179-s*(th/2+1), sf, s*(45-extr), 15);
        translate([0,0,0]) rotate([-90,0,180]) 
             translate([-bigR/sf,0,0]) 
                  spin(cr, bigR/sf, 179-s*(th/2+1), sf, s*(45-extr), 15);
        translate([(1+cos(th/2))*bigR/sf,sin(th/2)*bigR/sf,0]) scale([sf,sf,sf]) rotate([45+extr,0,th/4-90])  HornLink3(k-1, th, 45);
        translate([(1+cos(th/2))*bigR/sf,-sin(th/2)*bigR/sf,0]) scale([sf,sf,sf]) rotate([45-extr,0,90-th/4])  HornLink3(k-1, th, 0);
    }
}

module HornLink4(k, th=45) {
    if (k>0) {
       union() {
           scale([tf, tf, ff]) rotate([90,0,0]) 
               sphere(1.1*bigR);
           rotate([90,0,180]) translate([-bigR/sf,0,0])
               spin(cr, bigR/sf, 180-th/2, sf, 45, 30);
           rotate([-90,0,180]) translate([-bigR/sf,0,0]) 
               spin(cr, bigR/sf, 180-th/2, sf, 45, 30);    
       }
        translate([(1+cos(th/2))*bigR/sf,sin(th/2)*bigR/sf,0]) scale([sf,sf,sf]) rotate([45,0,th/4-90]) HornLink3(k-1, th, 45);
        translate([(1+cos(th/2))*bigR/sf,-sin(th/2)*bigR/sf,0]) scale([sf,sf,sf]) rotate([45,0,90-th/4]) HornLink3(k-1, th, 0);
    }
}

module FinalLink() {
    echo("in FinalLink\n");
    union() {
        scale([tf, ff, ff]) rotate([90,0,0]) sphere(1.05*bigR);
        rotate([90,0,180]) translate([-bigR/sf,0,0])
            spin(cr, bigR/sf, 181, sf, 10);
        rotate([-90,0,180]) translate([-bigR/sf,0,0]) 
            spin(cr, bigR/sf, 181, sf, 10);  
    }    
}





/* difference() {
    union() {
        translate([0,0,-70]) rotate([0,-90,35]) HornLink4(2,65);
        scale([tf,1,1]) intersection() {
            translate([0,0,-180]) sphere(180, $fn=100);
            cylinder(r=75,h=400,center=true, $fn=50);
        }
    }
    translate([0,0,-269]) cube(500, center=true);
}
*/

HornLink3(2,65);
//HornLink4(3,66);
//FinalLink();
