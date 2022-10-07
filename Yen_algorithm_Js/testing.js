const graphlib = require('graphlib');

function Dijkstra_algorithm (g, source, sink, weightFunc, edgeFunc) {
    if (!weightFunc) {
        weightFunc = (e) => g.edge(e);
    }
    
    let dijkstra = graphlib.alg.dijkstra(g, source, weightFunc, edgeFunc);
     
    // Check if there is a valid path
     if (dijkstra[sink].distance === Number.POSITIVE_INFINITY) {
        return null;
    }

    let edges = [];
    let currentNode = sink;
    while (currentNode !== source) {
        let previousNode = dijkstra[currentNode].predecessor;

        // extract weight from edge, using weightFunc if supplied, or the default way
        let weightValue;
        if (weightFunc) {
            weightValue = weightFunc({ v: previousNode, w: currentNode });
        } else {
            weightValue = g.edge(previousNode, currentNode)
        }
        let edge = getNewEdge(previousNode, currentNode, weightValue);
        edges.push(edge);
        currentNode = previousNode;
    }

    let path = [];
    for (let i=0; i<edges.length; i++){
        if (i==0){
            path.push(edges[i].toNode);
            path.push(edges[i].fromNode);
        }
        else
            path.push(edges[i].fromNode);
    }


    let result = {
        Total_Weight: dijkstra[sink].distance,
        edges: edges.reverse(),
        path: path.reverse()
    };
    return result;
}

//Function to build a new edge 
function getNewEdge(fromNode, toNode, weight) {
    return {
        fromNode: fromNode,
        toNode: toNode,
        weight: weight
    }
}

let g = new graphlib.Graph({directed: true, compound: true, multigraph: true});
// Input the graph
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

console.log(Dijkstra_algorithm(g,"S","T"));