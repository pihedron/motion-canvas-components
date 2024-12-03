import { Circle, Line, Node, NodeProps, PossibleCanvasStyle, signal, Txt } from '@motion-canvas/2d'
import {
  all,
  createRef,
  PossibleVector2,
  Reference,
  SignalValue,
  SimpleSignal,
  Vector2,
} from '@motion-canvas/core'

type Edge = {
  to: number
  ref?: Reference<Line>
}

export interface GraphProps extends NodeProps {
  graph: SignalValue<Edge[][]>
  points: SignalValue<PossibleVector2[]>
}

export class Graph extends Node {
  @signal()
  public declare readonly graph: SimpleSignal<Edge[][], this>

  @signal()
  public declare readonly points: SimpleSignal<PossibleVector2[], this>

  private visited: boolean[]

  constructor(props: GraphProps) {
    super(props)
    this.visited = Array(this.graph().length)
  }

  *create(duration: number) {
    for (let v = 0; v < this.graph().length; v++) {
      yield* this.plot(v, duration)

      this.visited[v] = true

      for (let edge of this.graph()[v]) {
        const l = createRef<Line>()
        this.add(
          <Line
            points={[this.points()[v], this.points()[edge.to]]}
            stroke={'white'}
            lineWidth={8}
            lineCap={'round'}
            ref={l}
            end={0}
          >
            <Line
              points={[this.points()[v], this.points()[edge.to]]}
              end={0}
              stroke={'white'}
              lineWidth={8}
              lineCap={'round'}
              endArrow
              arrowSize={16}
            ></Line>
          </Line>
        )

        edge.ref = l

        yield* l().end(1, duration)

        yield* this.plot(edge.to, duration)
      }
    }
  }

  // does not work yet
  *uncreate(duration: number) {
    for (let v = this.graph().length - 1; v >= 0; v--) {
      yield* this.plot(v, duration)

      this.visited[v] = true

      for (let edge of this.graph()[v]) {
        const l = createRef<Line>()
        this.add(
          <Line
            points={[this.points()[v], this.points()[edge.to]]}
            stroke={'white'}
            lineWidth={8}
            lineCap={'round'}
            ref={l}
            end={0}
          >
            <Line
              points={[this.points()[v], this.points()[edge.to]]}
              end={0}
              stroke={'white'}
              lineWidth={8}
              lineCap={'round'}
              endArrow
              arrowSize={16}
            ></Line>
          </Line>
        )

        edge.ref = l

        yield* l().end(1, duration)

        yield* this.plot(edge.to, duration)
      }
    }
  }

  *plot(v: number, duration: number) {
    if (!this.visited[v]) {
      const c = createRef<Circle>()

      this.add(
        <Circle
          fill={'white'}
          scale={0}
          width={64}
          height={64}
          ref={c}
          position={this.points()[v]}
          zIndex={1}
        >
          <Txt
            fontFamily={'JetBrains Mono'}
            fontSize={32}
            fill={'#202020'}
            text={v.toString()}
          ></Txt>
        </Circle>
      )

      yield* c().scale(1, duration)
    }

    this.visited[v] = true
  }

  *direct(duration: number) {
    for (const edges of this.graph()) {
      for (const edge of edges) {
        yield* (edge.ref().children()[0] as Line).end(0.5, duration) // turns out this is better than points
      }
    }
  }

  *undirect(duration: number) {
    for (const edges of this.graph().reverse()) {
      for (const edge of edges.reverse()) {
        yield* (edge.ref().children()[0] as Line).end(0, duration)
      }
    }
  }

  *retract(v: number, e: number, duration: number) {
    yield* all(
      this.graph()[v][e].ref().end(0, duration),
      (this.graph()[v][e].ref().children()[0] as Line).end(0, duration),
    )
  }
  
  *extend(v: number, e: number, duration: number) {
    yield* all(
      this.graph()[v][e].ref().end(1, duration),
      (this.graph()[v][e].ref().children()[0] as Line).end(0.5, duration),
    )
  }

  *mark(v: number, e: number, stroke: PossibleCanvasStyle, duration: number) {
    yield* all(
      this.graph()[v][e].ref().stroke(stroke, duration),
      (this.graph()[v][e].ref().children()[0] as Line).stroke(stroke, duration),
    )
  }

  *unmark(v: number, e: number, duration: number) {
    yield* all(
      this.graph()[v][e].ref().stroke('white', duration),
      (this.graph()[v][e].ref().children()[0] as Line).stroke('white', duration),
    )
  }
}
