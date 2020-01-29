use <braille-v2.scad>;

$wd=175;
$hi=175;
$rd=8;
$wt=1;
$recess=.5;
$thk=5;
$xtra=60;
$viewport_x=140;
$viewport_y=140;

//scale([.255,.255,.005]) surface(file = "permute-dihedral-four_v3.png", center = true, invert = true);

union() {
    //scale([.45,.45,.04]) surface(file = "desmos-graph-axes.png", center = true, invert = false);
    //translate([0,0,9]) scale([.45,.45,.06]) surface(file = "desmos-graph-line.png", center = true, invert = true);
    //translate([0,0,10]) scale([.45,.45,.07]) surface(file = "desmos-graph-parabola.png", center = true, invert = true);
    //translate([0,0,4.5]) scale([.255,.255,.005]) surface(file = "permute-dihedral-four_v3.png", center = true, invert = true);
    
    
    difference() {
        hull() {
            translate([$wd/2-$rd,$wd/2-$rd,0]) cylinder(r=$rd, h=$thk-$recess);
            translate([-($wd/2-$rd),$wd/2-$rd,0]) cylinder(r=$rd, h=$thk-$recess);
            translate([-($wd/2-$rd),-($wd/2-$rd)-$xtra,0]) cylinder(r=$rd, h=$thk-$recess);
            translate([$wd/2-$rd,-($wd/2-$rd)-$xtra,0]) cylinder(r=$rd, h=$thk-$recess);
        }
        translate([0,0,5+$thk-2*$recess]) {
            hull() {
                cube([$viewport_x,$viewport_y,10], center=true);
                cube([$viewport_x+3,$viewport_y+3,8], center=true);
            }
        }
        translate([-80,80,-1]) cylinder(r=3,h=10);
        for (i=[-$wd/2:4:$wd/2]) {
            for (j=[-$hi/2-$xtra:4:$hi/2]) {
                translate([i,j,-$recess]) cube([3,3,2*$recess]);
            }
        }
                
    }
    
    translate([0,-144,4]) label([
    "Figure #5.25 shows the",  
    "dihedral group ^D#4 ", 
    "The corners of a square", 
    "are numbered #1 through", 
    "#4 going clockwise, ^The", 
    "#4 axes of reflection are", 
    "dashed"], just=0); 
    difference() {
        hull() {
            translate([$wd/2-$rd,$wd/2-$rd,0]) cylinder(r=$rd, h=$thk);
            translate([-($wd/2-$rd),$wd/2-$rd,0]) cylinder(r=$rd, h=$thk);
            translate([-($wd/2-$rd),-($wd/2-$rd)-$xtra,0]) cylinder(r=$rd, h=$thk);
            translate([$wd/2-$rd,-($wd/2-$rd)-$xtra,0]) cylinder(r=$rd, h=$thk);
        }
        hull() {
            translate([$wd/2-$rd,$wd/2-$rd,-1]) cylinder(r=$rd-1, h=$thk+2);
            translate([-($wd/2-$rd),$wd/2-$rd,-1]) cylinder(r=$rd-1, h=$thk+2);
            translate([-($wd/2-$rd),-($wd/2-$rd)-$xtra,-1]) cylinder(r=$rd-1, h=$thk+2);
            translate([$wd/2-$rd,-($wd/2-$rd)-$xtra,-1]) cylinder(r=$rd-1, h=$thk+2);
        }
    }       
}


