const classTypes={
    calculus:["Calculus AB","Calculus BC"],
    physics:["Physics Level 1","Physics Level 2"],
    other: ["World Literature", "World History", "Biology"],
}
const map=new Map();
var areas=[];
for(var area in classTypes) {
    areas.push(area);    
    for(var type of classTypes[area]) {
        map.set(type,area);
    }
}

class ClassTypes {
    classTypes=classTypes;
    getAreas() {
        return areas;
    }
    getClasses(area) {
        return classTypes[area];
    }
    getArea(cls) {
        return map.get(cls);
    }
}

export default new ClassTypes();