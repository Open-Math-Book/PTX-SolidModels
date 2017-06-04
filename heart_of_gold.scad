$fn=80;

module fin() {
    linear_extrude(height=5) {
        
            scale([1.50,1,1]) difference(){ circle(40); translate([15,0,0]) circle(30); }
           
    }
}

/* union(){
    scale([4,1,1]) sphere(20, $fn=100);
    rotate([0,90,0]) cylinder(h=80, r=20, $fn=80);
    translate([80,0,0]) scale([2,1,1]) sphere(20, $fn=100);
    translate([95,0,-.5]) fin();
    translate([95,.5,0]) rotate([90,0,0]) fin();
 
} */

scale(.2) {
rotate([45,0,0]) union() {
    intersection() { 
        translate([100,0,0]) cube(200, center=true); 
        scale([3,1,1]) sphere(30);
    }
    intersection() { 
        translate([-100,0,0]) cube(200, center=true); 
        scale([4,1,1]) sphere(30);
    }
    translate([60,0,-1.5]) fin();
    translate([60,1.5,0]) rotate([90,0,0]) fin();
    rotate([0,-90,0]) cylinder( h=150, r1=13, r2=2);
}
}