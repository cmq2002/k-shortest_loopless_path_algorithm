const graphlib = require('graphlib');

// Dijkstra algorithm to find the shortest path
function Dijkstra_algorithm (g, source, sink, weightFunc, edgeFunc) {
    if (!weightFunc) {
        weightFunc = (e) => g.edge(e);
    }
    
    let dijkstra = graphlib.alg.dijkstra(g, source, weightFunc, edgeFunc);
  
    // Check if there is a valid path
    if (dijkstra[sink].distance === Number.POSITIVE_INFINITY) {
        return null;
    }
    
    //Show weight of each edge in the path
    let edges = [];
    let currentNode = sink;
    while (currentNode !== source) {
        let previousNode = dijkstra[currentNode].predecessor;
        // Extract weight from edge, using weightFunc if supplied, or the default way
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

    //Show the whole path
    let traversal = [];
    for (let i=0; i<edges.length; i++){
        if (i==0){
            traversal.push(edges[i].toNode);
            traversal.push(edges[i].fromNode);
        }
        else
        traversal.push(edges[i].fromNode);
    }
    
    
    let result = {
        Total_Weight: dijkstra[sink].distance,
        edges: edges.reverse(),
        traversal: traversal.reverse()
    };
    
    return result;
}

// Function to build a new edge 
function getNewEdge(fromNode, toNode, weight) {
    return {
        fromNode: fromNode,
        toNode: toNode,
        weight: weight
    }
}

// Use when we want to add edges back to the graph
function addEdges(g, edges) {
    edges.forEach(e => {
        g.setEdge(e.fromNode, e.toNode, e.edgeObj);
    })
}

// Input: a graph and a node to remove
// Return value: array of removed edges
function removeNode(g, rn, weightFunc) {

    let remEdges = [];
    let edges = copy_Object(g.edges());
    // Save all the edges we are going to remove
    edges.forEach(edge => {
        if (edge.v == rn || edge.w == rn) {

            // Extract weight
            let weightValue;
            if (weightFunc) {
                weightValue = weightFunc(edge);
            } else {
                weightValue = g.edge(edge);
            }

            let e = getNewEdge(edge.v, edge.w, weightValue);
            remEdges.push(e);
        }
    })
    g.removeNode(rn); // Removing the node from the graph
    return remEdges;
}

// Compare between two path objects, return true if equals
function isPathEqual(path1, path2) {
    if (path2 == null) {
        return false;
    }

    let numEdges1 = path1.edges.length;
    let numEdges2 = path2.edges.length;

    // Compare number of edges
    if (numEdges1 != numEdges2) {
        return false;
    }

    // Compare each edge
    for (let i = 0; i < numEdges1; i++) {
        let edge1 = path1.edges[i];
        let edge2 = path2.edges[i];
        if (edge1.fromNode != edge2.fromNode) {
            return false;
        }
        if (edge1.toNode != edge2.toNode) {
            return false;
        }
    }

    return true;
}

// Since javascript sends object by ref, we sometimes want to clone objects and its childs to avoid it
function copy_Object(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Return a new path object from source path to a given index
function copy_Path(path, i) {
    let newPath = copy_Object(path);
    let edges = [];
    let traversal = [];
    let l = path.edges.length;
    if (i > l) {
        i = 1;
    }
    // Copy i edges from the source path
    for (let j=0; j<i; j++) {
        edges.push(path.edges[j]);
    }

    //Copy the travesal
    for (let k=0; k<i; k++){
        traversal.push(path.traversal[k]);
    }

    // Calculate the weight of the new path
    newPath.Total_Weight = 0;
    edges.forEach(edge => {
        newPath.Total_Weight += edge.weight;
    })
    
    newPath.edges = edges;

    newPath.traversal = traversal;
    
    return newPath;
}

// Return true if a given path is found on array of path
function isPathExistInArray(B, path) {
    B.forEach(b => {
        if (isPathEqual(b, path)) {
            return true;
        }
    })
    return false;
}

// Sort the list B by total weight, then remove and return the smallest weight path.
function pick_kth_from_B(B) {
    return B.sort((a, b) => a.Total_Weight - b.Total_Weight).shift();
}

function Yen_algorithm (g, source, sink, K, weightFunc, edgeFunc) {
    // Initialize containers for potential paths and k shortest paths
    let A = [];
    let B = [];

    // Make a copy of the input graph to avoid changes to the original
    let _g = graphlib.json.read(graphlib.json.write(g));

    // Compute and add the 1st shortest path
    let path_kth = Dijkstra_algorithm(_g, source, sink, weightFunc, edgeFunc);
    if (!path_kth) {
        return A;
    }
    A.push(path_kth);
    
    // Iteratively compute the next k shortest paths 
    for (let k = 1; k < K; k++) {

        // Get the (k-1)st shortest path
        let previousPath = copy_Object(A[k - 1]); // Copy path to new var

        if (!previousPath) {
            break;
        }

        for (let i = 0; i < previousPath.edges.length; i++) {


            // Initialize a container to store the removed edges for this iteration
            let removedEdges = [];

            // Spur node = currently visited node in the (k-1)st shortest path
            let spurNode = previousPath.edges[i].fromNode;

            // Root path = prefix portion of the (k-1)st path up to the spur node
            let rootPath = copy_Path(previousPath, i);

            // Iterate over all of the (k-1) shortest paths 
            A.forEach(p => {
                p = copy_Object(p); // copy p
                let stub = copy_Path(p, i);

                // Check to see if this path has the same root as the (k-1)st shortest path
                if (isPathEqual(rootPath, stub)) {
                    // If so, eliminate the next edge in the path from the graph (later on, this forces the spur
                    // node to connect the root path with an un-found suffix path)
                    let re = p.edges[i];
                    _g.removeEdge(re.fromNode, re.toNode);
                    removedEdges.push(re);
                }
            })

            // Temporarily remove all of the nodes in the root path, other than the spur node, from the graph 
            rootPath.edges.forEach(rootPathEdge => {
                let rn = rootPathEdge.fromNode;
                if (rn !== spurNode) {
                    // remove node and return removed edges
                    let removedEdgeFromNode = removeNode(_g, rn, weightFunc);
                    removedEdges.push(...removedEdgeFromNode);
                }
            })

            // Spur path = shortest path from spur node to the destination in the reduced graph
            let spurPath = Dijkstra_algorithm(_g, spurNode, sink, weightFunc, edgeFunc);

            // If a new spur path was identified:
            if (spurPath != null) {
                // Joining the root and spur paths to form the new path
                let totalPath = copy_Object(rootPath);
                let edgesToAdd = copy_Object(spurPath.edges);
                totalPath.edges.push(...edgesToAdd);
                totalPath.Total_Weight += spurPath.Total_Weight;

                // If the path has not been generated previously, add it
                if (!isPathExistInArray(B, totalPath)) {
                    B.push(totalPath);
                }
            }

            addEdges(_g, removedEdges);
        }

        // Identify the potential path with the shortest weight 
        let isNewPath;
        do {
            path_kth = pick_kth_from_B(B);
            isNewPath = true;
            if (path_kth != null) {
                for (let p of A) {
                    // Check to see if this path duplicates a previously found path
                    if (isPathEqual(p, path_kth)) {
                        isNewPath = false;
                        break;
                    }
                }

            }
        } while (!isNewPath);

        // If there were not any more paths, stop
        if (path_kth == null) {
            break;
        }

        // Add the best, non-duplicate path identified as the k shortest path
        A.push(path_kth);
    } 

    return A;
}

module.exports = {Yen_algorithm};

