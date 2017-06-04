
//translate([-4.5,-1,-2]) cube([9,4,10]);
//rotate([90,0,0]) translate([0,0,0]) linear_extrude(height = 3, center = false, convexity = 10, twist = 0, slices = 2, scale = 1.0) { text(chr(87), size=6,halign="center", font="Liberation Sans:style=Bold"); }

module cuboid(x,y,z,rd) {
    translate([rd,rd,rd]) minkowski(){
        cube([x-2*rd,y-2*rd,z-2*rd]);
        sphere(r=rd, $fn=20);
    }
}

module letter_disk() {
union() {
    for (i=[0:25]) {
        rotate([0,0,i/26*360]) translate([0,-40,0]) {
            difference() {
                translate([-5,-.5,0]) cuboid(10,5,10,1);
                rotate([90,0,0]) translate([0,2,-1]) linear_extrude(height = 4, center = false, convexity = 10, twist = 0, slices = 2, scale = 1.0) { 
                text(chr(65+i), size=6,halign="center", font="Liberation Sans:style=Bold"); 
                }
            }
        }
    }
    translate([0,0,0]) cylinder(r=39,h=10.5, $fn=100);
}
}

module base() {
difference() {
    union() {
        letter_disk();
        cylinder(r=28, h=27, $fn=100);
    }
    translate([0,0,-3]) cylinder(r=21, h=33, $fn=50);
    translate([0,0,21.3]) difference() {
        translate([-50,-50,0]) cube([100,100,5]);
        translate([0,0,-1]) cylinder(r=26,h=5, $fn=100);
        translate([0,0,3]) cylinder(r1=26,r2=28,h=2, $fn=100);
    }
}}

module top() {
   difference() {
      letter_disk();
      translate([0,0,-1]) cylinder(r=28.3,h=12, $fn=100);
   } 
}

module frame() {
    difference() {
        union() {
            hull() {
                translate([-10,-13,0]) cube([55,26,4]);
                cylinder(r=32,h=4);
            }
            translate([39,-13,0]) cube([6,26,30]);
        }
        translate([0,0,-1]) cylinder(r=26.1, h=6, $fn=100);
        translate([-10,0,-1]) cylinder(r=26.1, h=6, $fn=100);
        translate([-25,-50,-1]) cube([15,100,6]);
        hull() {
            translate([40.5,-6,5]) cube([10,12,20]);
            translate([43.5,-9,2]) cube([10,18,26]);
        }
        translate([0,0,4.1]) cylinder(r=41, h=30, $fn=100);
        translate([0,0,-.6]) cylinder(r1=28.1,r2=26.1,h=2, $fn=100);
        translate([-10,0,-.6]) cylinder(r1=28.1,r2=26.1,h=2, $fn=100);
    }
}

color("green") base();
translate([0,0,10.6]) color("blue") top();

 translate([0,0,25.5]) rotate([180,0,-90]) color("yellow") frame();
//frame();