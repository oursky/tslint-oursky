<LintErrorCase {...{}} a={{}} b={[]} c={{ a: "b" }} d={[1]} e={/ab/} />;
const obj = {};
const arr = [];
const regex = /ab/;
<NoLintErrorCase {...obj} a={1} b="2" c={"3"} d={obj} e={arr} f={regex} />;
