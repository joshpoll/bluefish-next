import { text, nil, rect, ellipse } from "./mark";
import { GlyphFn, Glyph, Relation, lowerGlyphFn, Ref, ref, mkMyRef, compileGlyphFn, MyRef } from './glyph';
import { alignCenterX, alignCenterY, alignLeft, hSpace, vAlignCenter, vSpace } from "./gestalt";

const glyphV3Example: GlyphFn<{}> = GlyphFn.mk(
  {
    glyphs: {
      "text": text({ contents: "hello world!", fontSize: "24px" }),
    },
    relations: [{
      fields: ["$canvas", "$canvas"],
      constraints: [],
    }]
  }
);

const objectGlyphExample: GlyphFn<number> = GlyphFn.mk(
  {
    glyphs: {
      "text": text({ contents: "hello world!", fontSize: "24px" }),
    },
    objectGlyph: GlyphFn.mk((d: number) => text({ contents: "hello world!", fontSize: "24px" })),
    relations: [{
      fields: ["$canvas", "text"],
      constraints: [],
    }]
  }
);

// const fieldsGlyphExample_: GlyphFn_<number, "text"> = {
//   glyphs: {
//     "text": text({ contents: "hello world!", fontSize: "24px" }),
//   },
//   relations: [{
//     fields: ["$canvas", "$canvas"],
//     constraints: [],
//   }]
// }

// const fieldsGlyphExample: GlyphFn<number> = {
//   [KONT]: (kont) => kont({
//     glyphs: {
//       "text": text({ contents: "hello world!", fontSize: "24px" }),
//     },
//     relations: [{
//       fields: ["$canvas", "$canvas"],
//       constraints: [],
//     }]
//   })
// }

const fieldsGlyphExample: GlyphFn<{ item: number }> = GlyphFn.mk({
  glyphs: {
    foo: nil(),
  },
  fieldGlyphs: {
    item: GlyphFn.mk((d: number) => nil()),
  },
  relations: [
    {
      fields: ["$canvas", "$canvas"],
      constraints: []
    },
    {
      fields: ["foo", "item"],
      constraints: []
    },
  ]
});

export namespace GlyphFnLowerTest {
  type myDataE2 = { color1: string, color2: string, color3: string };
  const dataE2: myDataE2 = { color1: "firebrick", color2: "steelblue", color3: "black", /* "text": "hello world!" */ };

  export const exampleRelationInterface2: GlyphFn<myDataE2> = GlyphFn.mk({
    glyphs: {
      "text": text({ contents: "hello world!", fontSize: "24px" }),
    },
    fieldGlyphs: {
      "color1": GlyphFn.mk((color1) => rect({ width: 500 / 3, height: 200 / 3, fill: color1 })),
      "color2": GlyphFn.mk((color2) => ellipse({ rx: 300 / 6, ry: 200 / 6, fill: color2 })),
      "color3": GlyphFn.mk((color3) => ellipse({ rx: 50, ry: 50, fill: color3 })),
      // "text": (textData) => text({ text: textData, fontSize: "calc(10px + 2vmin)" }),
    },
    relations: [
      { fields: ["color1", "color2"], constraints: [vSpace(50.), alignCenterX] },
      { fields: ["color1", "color3"], constraints: [hSpace(50.), alignCenterY] },
      { fields: ["color3", "text"], constraints: [vSpace(50.), alignCenterX] },
      { fields: ["$canvas", "color1"], constraints: [alignLeft] },
    ]
  })

  type MarblesData = {
    elements: Relation<number>,
  };

  const marblesData: MarblesData = {
    elements: [1, 2, 3, 4],
  };

  const element: GlyphFn<number> = GlyphFn.mk({
    glyphs: {
      "circle": ellipse({ rx: 300 / 6, ry: 200 / 6, fill: "coral" }),
    },
    objectGlyph: GlyphFn.mk((n) => text({ contents: n.toString(), fontSize: "24px" })),
    relations: [
      // uh oh! no way to write constraints since dataGlyphs is anonymous!!!
    ]
  });

  export const marbles: GlyphFn<MarblesData> = GlyphFn.mk({
    glyphs: {
      // "text": text({ text: "hello world!", fontSize: "24px" }),
    },
    fieldGlyphs: {
      elements: element,
      // "color1": (color1) => rect({ width: 500 / 3, height: 200 / 3, fill: color1 }),
      // "color2": (color2) => ellipse({ rx: 300 / 6, ry: 200 / 6, fill: color2 }),
      // "color3": (color3) => ellipse({ rx: 50, ry: 50, fill: color3 }),
      // "text": (textData) => text({ text: textData, fontSize: "calc(10px + 2vmin)" }),
    },
    relations: [
      // e.g. "color1" refers to the bbox of the "color1" glyph defined above
      // { fields: ["text", "color2"], constraints: [vSpace(50.)] },
      // { fields: ["color1", "color3"], constraints: [hSpace(50.), alignCenterY] },
      // { fields: ["color3", "text"], constraints: [vSpace(50.), alignCenterX] },
      // // this works b/c canvas can have negative coordinates I think? not really sure
      // { fields: ["canvas", "color1"], constraints: [alignLeft] },
      // { fields: ["color1", "color2"], constraints: [alignCenterX] },
    ]
  })

  export const testLoweredGlyphExample = lowerGlyphFn(exampleRelationInterface2)(dataE2);
  export const testLoweredGlyphMarbles = lowerGlyphFn(marbles)(marblesData);
}

export type MyListOld<T> = {
  elements: Relation<T>,
  // TODO: can refine Ref type even more to say what it refers to
  neighbors: Relation<{
    curr: Ref<MyListOld<T>, "elements">,
    next: Ref<MyListOld<T>, "elements">,
  }>
}

type Ref2<T, U> = any;
type Ref3<T> = any;

type MyListRef2<T> = {
  elements: Relation<Ref2<T, "">>,
  neighbors: Relation<{
    curr: Ref2<MyListOld<T>, "elements">,
    next: Ref2<MyListOld<T>, "elements">,
  }>
}

type MyListRef3<T> = {
  elements: Relation<Ref3<T>>,
  neighbors: Relation<{
    curr: Ref3<T>,
    next: Ref3<T>,
  }>
}

type RIWithRef<T> = any;

const mkRef = <T>(foo: RIWithRef<T>) => foo.$ref;

type MyList2<T> = {
  elements: Relation<T>,
  // TODO: can refine Ref type even more to say what it refers to
  neighbors: Relation<Ref<MyList2<T>, "elements">>
}

//     { curr: ref("elms[0]"), next: ref("elms[1]") },
//     { curr: ref("elms[1]"), next: ref("elms[2]") },
//     { curr: ref("elms[2]"), next: ref("elms[3]") },

const myListExample: MyListOld<number> = {
  elements: [10, 20, 30, 40],
  neighbors: [
    { curr: ref("elements", "[0]"), next: ref("elements", "[1]") },
    { curr: ref("elements", "[1]"), next: ref("elements", "[2]") },
    { curr: ref("elements", "[2]"), next: ref("elements", "[3]") },
  ]
}

const G = Glyph;
const GF = GlyphFn;

const myListGlyphFn: GlyphFn<MyListOld<number>> = GF.mk({
  fieldGlyphs: {
    "elements": GF.mk((element) => rect({ width: element, height: 200 / 3, fill: "black" })),
    "neighbors": GF.mk({
      /* TODO: not sure if/how refs should be rendered */
      /* for now we will say it shouldn't be rendered */
      relations: [
        // TODO: not sure why type safety is lost!
        {
          fields: ["curr", "next"],
          constraints: [vSpace(10.)],
        }
      ]
    }),
  }
})

export const loweredListGlyphTest = lowerGlyphFn(myListGlyphFn)(myListExample);


export type MyList<T> = {
  elements: Relation<T>,
  // TODO: can refine Ref type even more to say what it refers to
  neighbors: Relation<{
    curr: MyRef,
    next: MyRef,
  }>
}

export namespace GlyphFnCompileTest {
  type myDataE2 = { color1: string, color2: string, color3: string };
  const dataE2: myDataE2 = { color1: "firebrick", color2: "steelblue", color3: "black", /* "text": "hello world!" */ };

  export const exampleRelationInterface2: GlyphFn<myDataE2> = GlyphFn.mk({
    glyphs: {
      "text": text({ contents: "hello world!", fontSize: "24px" }),
    },
    fieldGlyphs: {
      "color1": GlyphFn.mk((color1) => rect({ width: 500 / 3, height: 200 / 3, fill: color1 })),
      "color2": GlyphFn.mk((color2) => ellipse({ rx: 300 / 6, ry: 200 / 6, fill: color2 })),
      "color3": GlyphFn.mk((color3) => ellipse({ rx: 50, ry: 50, fill: color3 })),
      // "text": (textData) => text({ text: textData, fontSize: "calc(10px + 2vmin)" }),
    },
    relations: [
      { fields: ["color1", "color2"], constraints: [vSpace(50.), alignCenterX] },
      { fields: ["color1", "color3"], constraints: [hSpace(50.), alignCenterY] },
      { fields: ["color3", "text"], constraints: [vSpace(50.), alignCenterX] },
      { fields: ["$canvas", "color1"], constraints: [alignLeft] },
    ]
  })

  type MarblesData = {
    elements: Relation<number>,
  };

  const marblesData: MarblesData = {
    elements: [1, 2, 3, 4],
  };

  const element: GlyphFn<number> = GlyphFn.mk({
    glyphs: {
      "circle": ellipse({ rx: 300 / 6, ry: 200 / 6, fill: "coral" }),
    },
    objectGlyph: GlyphFn.mk((n) => text({ contents: n.toString(), fontSize: "24px" })),
    relations: [
      { fields: ["$object", "circle"], constraints: [alignCenterX, alignCenterY] }
    ]
  });

  export const marbles: GlyphFn<MarblesData> = GlyphFn.mk({
    glyphs: {
      // "text": text({ text: "hello world!", fontSize: "24px" }),
    },
    fieldGlyphs: {
      elements: element,
      // "color1": (color1) => rect({ width: 500 / 3, height: 200 / 3, fill: color1 }),
      // "color2": (color2) => ellipse({ rx: 300 / 6, ry: 200 / 6, fill: color2 }),
      // "color3": (color3) => ellipse({ rx: 50, ry: 50, fill: color3 }),
      // "text": (textData) => text({ text: textData, fontSize: "calc(10px + 2vmin)" }),
    },
    relations: [
      // e.g. "color1" refers to the bbox of the "color1" glyph defined above
      // { fields: ["text", "color2"], constraints: [vSpace(50.)] },
      // { fields: ["color1", "color3"], constraints: [hSpace(50.), alignCenterY] },
      // { fields: ["color3", "text"], constraints: [vSpace(50.), alignCenterX] },
      // // this works b/c canvas can have negative coordinates I think? not really sure
      // { fields: ["canvas", "color1"], constraints: [alignLeft] },
      // { fields: ["color1", "color2"], constraints: [alignCenterX] },
    ]
  })

  export const testCompiledGlyphFnExample = compileGlyphFn(exampleRelationInterface2)(dataE2);
  export const testCompiledGlyphFnMarbles = compileGlyphFn(marbles)(marblesData);

  type MarblesList = MyList<number>;

  const marblesList: MarblesList = {
    elements: [1, 2, 3, 4],
    neighbors: [
      { curr: mkMyRef("../../elements/0"), next: mkMyRef("../../elements/1") },
      { curr: mkMyRef("../../elements/1"), next: mkMyRef("../../elements/2") },
      { curr: mkMyRef("../../elements/2"), next: mkMyRef("../../elements/3") },
    ]
  };

  export const marblesListGlyphFn: GlyphFn<MarblesList> = GlyphFn.mk({
    glyphs: {
      // "text": text({ text: "hello world!", fontSize: "24px" }),
    },
    fieldGlyphs: {
      elements: element,
      neighbors: GF.mk({
        relations: [{ fields: ["curr", "next"], constraints: [hSpace(5), alignCenterY] }]
      })
    },
  })

  export const testMarblesList = compileGlyphFn(marblesListGlyphFn)(marblesList);

  type MarblesListReduced = {
    marble1: number,
    marble2: number,
    marble1Ref: MyRef,
  };

  const marblesListReduced: MarblesListReduced = {
    marble1: 1,
    marble2: 2,
    marble1Ref: mkMyRef("marble1"),
  };

  export const marblesListReducedGlyphFn: GlyphFn<MarblesListReduced> = GlyphFn.mk({
    fieldGlyphs: {
      marble1: ellipse({ rx: 300 / 6, ry: 200 / 6, fill: "coral" }),
      marble2: ellipse({ rx: 300 / 6, ry: 200 / 6, fill: "coral" }),
    },
    relations: [{
      fields: ["marble1Ref", "marble2"],
      constraints: [hSpace(5), alignCenterY]
    }]
  })

  export const testMarblesListReduced = compileGlyphFn(marblesListReducedGlyphFn)(marblesListReduced);

  type MarblesListMoreComplex = {
    marbles: Relation<number>,
    // marble1: number,
    // marble2: number,
    neighbor: Relation<{
      curr: MyRef,
      next: MyRef,
    }>,
  };

  const marblesListMoreComplex: MarblesListMoreComplex = {
    marbles: [1, 2, 3],
    neighbor: [
      {
        curr: mkMyRef("../../marbles/0"),
        next: mkMyRef("../../marbles/1"),
      },
      {
        curr: mkMyRef("../../marbles/1"),
        next: mkMyRef("../../marbles/2"),
      }
    ]
  };

  export const marblesListMoreComplexGlyphFn: GlyphFn<MarblesListMoreComplex> = GlyphFn.mk({
    fieldGlyphs: {
      marbles: element,
      neighbor: Glyph.mk({
        relations: [{
          fields: ["curr", "next"],
          constraints: [hSpace(5.) /* TODO: not sure how to remove the specific value here and instead control the size of the entire thing */, alignCenterY]
        }]
      })
    },
  })

  export const testMarblesListMoreComplex = compileGlyphFn(marblesListMoreComplexGlyphFn)(marblesListMoreComplex);

  export const twoSetsOfMarbles: GlyphFn<{
    one: MarblesListMoreComplex,
    two: MarblesListMoreComplex
  }> = GlyphFn.mk({
    fieldGlyphs: {
      one: marblesListMoreComplexGlyphFn,
      two: marblesListMoreComplexGlyphFn,
    },
    relations: [
      {
        fields: ["one", "two"],
        constraints: [vAlignCenter, vSpace(20)],
      }
    ]
  })

  const twoSetsOfMarblesData: {
    one: MarblesListMoreComplex,
    two: MarblesListMoreComplex
  } = {
    one: {
      marbles: [1, 2, 3],
      neighbor: [
        {
          curr: mkMyRef("../../marbles/0"),
          next: mkMyRef("../../marbles/1"),
        },
        {
          curr: mkMyRef("../../marbles/1"),
          next: mkMyRef("../../marbles/2"),
        }
      ]
    },
    two: {
      marbles: [10, 20, 30],
      neighbor: [
        {
          curr: mkMyRef("../../marbles/0"),
          next: mkMyRef("../../marbles/1"),
        },
        {
          curr: mkMyRef("../../marbles/1"),
          next: mkMyRef("../../marbles/2"),
        }
      ]
    },
  };

  export const testTwoMarbleSets = compileGlyphFn(twoSetsOfMarbles)(twoSetsOfMarblesData);
}

export {}