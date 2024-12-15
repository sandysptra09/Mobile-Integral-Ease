export const sortPolynomial = (expression) => {
    const terms = expression.split('+').map(term => term.trim());
    const sorted = terms.sort((a, b) => {
      const degreeA = parseInt(a.match(/x\^(\d+)/)?.[1] || (a.includes('x') ? 1 : 0), 10);
      const degreeB = parseInt(b.match(/x\^(\d+)/)?.[1] || (b.includes('x') ? 1 : 0), 10);
      return degreeB - degreeA;
    });
    return sorted.join(' + ');
  };
  