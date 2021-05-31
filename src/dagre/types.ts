import { GraphLabel } from 'dagre'

export type GraphConfig = Partial<{
  rankdir: 'TB' | 'BT' | 'LR' | 'RL'
  align: 'UL' | 'UR' | 'DL' | 'DR'
  ranker: 'network-simplex' | 'tight-tree' | 'longest-path'
}> &
  Omit<GraphLabel, 'rankdir' | 'align' | 'ranker'>

// graph	rankdir	TB	Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right.
// graph	align	undefined	Alignment for rank nodes. Can be UL, UR, DL, or DR, where U = up, D = down, L = left, and R = right.
// graph	nodesep	50	Number of pixels that separate nodes horizontally in the layout.
// graph	edgesep	10	Number of pixels that separate edges horizontally in the layout.
// graph	ranksep	50	Number of pixels between each rank in the layout.
// graph	marginx	0	Number of pixels to use as a margin around the left and right of the graph.
// graph	marginy	0	Number of pixels to use as a margin around the top and bottom of the graph.
// graph	acyclicer	undefined	If set to greedy, uses a greedy heuristic for finding a feedback arc set for a graph. A feedback arc set is a set of edges that can be removed to make a graph acyclic.
// graph	ranker	network-simplex	Type of algorithm to assigns a rank to each node in the input graph. Possible values: network-simplex, tight-tree or longest-path
// node	width	0	The width of the node in pixels.
// node	height	0	The height of the node in pixels.
// edge	minlen	1	The number of ranks to keep between the source and target of the edge.
// edge	weight	1	The weight to assign edges. Higher weight edges are generally made shorter and straighter than lower weight edges.
// edge	width	0	The width of the edge label in pixels.
// edge	height	0	The height of the edge label in pixels.
// edge	labelpos	r	Where to place the label relative to the edge. l = left, c = center r = right.
// edge	labeloffset	10	How many pixels to move the label away from the edge. Applies only when labelpos is l or r.
