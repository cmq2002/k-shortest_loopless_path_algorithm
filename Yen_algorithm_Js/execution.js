const graphlib = require('graphlib');

let g = new graphlib.Graph({directed: true, compound: true, multigraph: true});
// Input the graph
//Ex1
/*g.setNode("C");
g.setNode("D");
g.setNode("E");
g.setNode("F");
g.setNode("G");
g.setNode("H");

g.setEdge ("C", "D", 3);
g.setEdge ("C", "E", 2);
g.setEdge ("E", "D", 1);
g.setEdge ("E", "F", 2);
g.setEdge ("E", "G", 3);
g.setEdge ("G", "H", 2);
g.setEdge ("D", "F", 4);
g.setEdge ("F", "G", 2);
g.setEdge ("F", "H", 1);

//Ex2
g.setNode("S");
g.setNode("X");
g.setNode("Y");
g.setNode("Z");
g.setNode("T");
g.setNode("U");
g.setNode("V");

g.setEdge ("S", "X", 1);
g.setEdge ("X", "Y", 1);
g.setEdge ("Y", "T", 1);
g.setEdge ("X", "Z", 4);
g.setEdge ("Z", "Y", 4);
g.setEdge ("Y", "U", 1);
g.setEdge ("U", "X", 1);
g.setEdge ("U", "V", 1);
g.setEdge ("V", "Y", 1);*/

//Ex3
g.setNode("S");
g.setNode("A");
g.setNode("B");
g.setNode("C");
g.setNode("D");
g.setNode("E");
g.setNode("F");
g.setNode("T");

g.setEdge ("S", "C", 3);
g.setEdge ("S", "A", 7);
g.setEdge ("S", "E", 2);
g.setEdge ("C", "A", 3);
g.setEdge ("C", "D", 5);
g.setEdge ("A", "D", 2);
g.setEdge ("A", "T", 3);
g.setEdge ("A", "B", 2);
g.setEdge ("B", "T", 5);
g.setEdge ("D", "C", 1);
g.setEdge ("D", "F", 1);
g.setEdge ("D", "T", 4);
g.setEdge ("E", "C", 2);
g.setEdge ("E", "F", 5);
g.setEdge ("F", "T", 3);

const Yen_running = require ('./algorithm.js');

console.log(Yen_running.Yen_algorithm(g, 'S','T',3));

