// src: https://algotree.org/algorithms/tree_graph_traversal/depth_first_search/all_paths_in_a_graph/

// Algorithm Find_All_Paths ( Graph g )
// 1.  Push the source node src in the path ( list ).
// 2.  DFS ( src, dest, g )

// DFS ( Source src, Destination dest, Graph g )
// 1.  If ( src == dest ) then
// 2.      A path has been found. Push the path in the list of all_the_paths ( list of list ).
// 3.  Else
// 4.     For every adjacent node adj_node that is adjacent to src do
// 5.        Push adj_node in the path.
// 6.        DFS ( adj_node, dest, g )
// 7.        Pop adj_node from the path. This is essentially a backtracking mechanism to find a different path from the source ( src ) node.

// Our version uses a graph represented by an edge list, rather than an
// adjacency list. We also prevent cycles by maintaining a list of edges
// already used.  





const dfsEnumeratePathsByEdges = (beginNode, endNode, edges) => {
  /**@type {ProcessStep[][]} */
  let paths = []
  
  /**@type {ProcessStep[]} */
  let currentPath = []

  /**@type {Set<string>} */
  let edgesUsed = new Set()
  
  /**
   * @param {ProcessEvent} source 
   * @param {ProcessEvent} target 
   */
  const dfs = (source, target) => {
    if (source.place === target.place) {
      paths = paths.concat([[...currentPath]])
    }
    
    for (let edge of edges) {
      if (
        edge.begin.place === source.place
        && !edgesUsed.has(edge.name)
      ) {
        currentPath.push(edge)
        edgesUsed.add(edge.name)

        dfs(edge.end, endNode)

        currentPath.pop()
        edgesUsed.delete(edge.name)
      }
    }
  }
  
  dfs(beginNode, endNode)
  
  return paths
}