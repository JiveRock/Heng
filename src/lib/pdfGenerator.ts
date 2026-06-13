import { jsPDF } from 'jspdf';
import { MathSolution } from '../services/geminiService';

/**
 * Clean up LaTeX strings to make them more human-readable in plain text PDF files.
 */
function formatLatexForPDF(latex: string): string {
  if (!latex) return '';
  return latex
    .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)') // Convert \frac{a}{b} to (a)/(b)
    .replace(/\\cdot/g, ' * ') // Multiplication
    .replace(/\\times/g, ' x ') // Multiplication cross
    .replace(/\\int_?([^{ \n]*)/g, '∫ $1') // Integrals
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\sec/g, 'sec')
    .replace(/\\csc/g, 'csc')
    .replace(/\\cot/g, 'cot')
    .replace(/\\lim_{([^}]+)}/g, 'lim ($1)') // Limit notation
    .replace(/\\to/g, '→') // Limit arrow
    .replace(/\\infty/g, '∞') // Infinity
    .replace(/\\hat{([^}]+)}/g, '$1̂') // Vectors / hat
    .replace(/\\vec{([^}]+)}/g, 'vec($1)') // Vectors
    .replace(/\\langle/g, '<')
    .replace(/\\rangle/g, '>')
    .replace(/\\begin{pmatrix}/g, '[')
    .replace(/\\end{pmatrix}/g, ']')
    .replace(/\\\\/g, ', ') // Matrices row splitter
    .replace(/&/g, ' ') // Matrices column splitter
    .replace(/\\det/g, 'det')
    .replace(/\\pm/g, '±')
    .replace(/\\quad/g, '   ') // Spacers
    .replace(/\\,/g, ' ') // Spacers
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\sqrt{([^}]+)}/g, '√($1)') // Square root
    .replace(/^{([^}]+)}/g, '^$1') // Super script
    .replace(/_?{([^}]+)}/g, '_$1') // Sub script
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\cdot/g, '·')
    .replace(/\\text{([^}]+)}/g, '$1') // Plain text wrappers
    .replace(/\\([a-zA-Z]+)/g, '$1') // Strip unmatched slashes
    .trim();
}

export function exportSingleSolutionToPDF(solution: MathSolution): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin; // 170mm
  const footerMargin = 15;

  let currentY = 20;

  // Helper: check page remaining space, add page if needed
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - footerMargin) {
      doc.addPage();
      drawHeader();
      currentY = 25; // Reset to top under header
    }
  };

  const drawHeader = () => {
    // Header line and text
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text('UNIVERSAL MATH ARCHITECT', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('STUDY GUIDE REPORT', pageWidth - margin - 40, 9);

    // Footer page outline (optional page numbering handled by jsPDF stream if needed)
    doc.setFontSize(7);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | Offline Study Tool`, margin, pageHeight - 8);
  };

  // 1. Initial Page Header
  drawHeader();
  currentY = 25;

  // Title Logo Block
  ensureSpace(20);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setDrawColor(219, 234, 254); // blue-100
  doc.setLineWidth(1);
  doc.line(margin, currentY, margin, currentY + 18); // Left thick blue accent line
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Step-by-Step Solution Report', margin + 6, currentY + 7);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(`LEVEL: ${solution.level.toUpperCase()}`, margin + 6, currentY + 13);
  currentY += 25;

  // 2. Problem Statement
  ensureSpace(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('PROBLEM EQUATION:', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900
  const plainProblem = formatLatexForPDF(solution.problemStatement);
  const problemLines = doc.splitTextToSize(plainProblem, contentWidth);
  ensureSpace(problemLines.length * 6 + 5);
  doc.text(problemLines, margin, currentY);
  currentY += problemLines.length * 6 + 10;

  // 3. Strategy / Why
  ensureSpace(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('STRATEGY & REASONING:', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // slate-700
  const stratLines = doc.splitTextToSize(solution.strategy, contentWidth);
  ensureSpace(stratLines.length * 5 + 5);
  doc.text(stratLines, margin, currentY);
  currentY += stratLines.length * 5 + 8;

  // 4. Core Concept
  ensureSpace(25);
  doc.setFillColor(239, 246, 255); // blue-50 accent
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.setLineWidth(0.3);
  
  const conceptText = `Core Theorem: ${solution.coreConcept}`;
  const conceptLines = doc.splitTextToSize(conceptText, contentWidth - 8);
  const boxHeight = conceptLines.length * 5 + 8;
  
  ensureSpace(boxHeight + 5);
  doc.rect(margin, currentY, contentWidth, boxHeight, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text(conceptLines, margin + 4, currentY + 6);
  currentY += boxHeight + 10;

  // 5. Steps Breakdown Header
  ensureSpace(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('LOGICAL BREAKDOWN & STEPS', margin, currentY);
  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
  currentY += 10;

  // Render Steps
  solution.steps.forEach((step, index) => {
    // Step Number Box & Title
    ensureSpace(35);

    // Light grey bar to group step header
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, contentWidth, 8, 'F');

    // Step Index Circle / Indicator
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(margin, currentY, 15, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP ${index + 1}`, margin + 2, currentY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(step.desc, margin + 18, currentY + 5.5);
    currentY += 12;

    // Step Latex formula (formatted)
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38); // Red math highlight
    const mathStr = formatLatexForPDF(step.latex);
    const mathLines = doc.splitTextToSize(`      ${mathStr}`, contentWidth - 10);
    ensureSpace(mathLines.length * 6 + 5);
    doc.text(mathLines, margin + 4, currentY);
    currentY += mathLines.length * 6 + 4;

    // Step Explanation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600
    const explLines = doc.splitTextToSize(step.explanation, contentWidth - 6);
    ensureSpace(explLines.length * 5 + 10);
    doc.text(explLines, margin + 4, currentY);
    currentY += explLines.length * 5 + 10;
  });

  // 6. Final Result Box
  ensureSpace(40);
  doc.setFillColor(37, 99, 235); // blue-600 green-ish or blue-700
  doc.rect(margin, currentY, contentWidth, 22, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(191, 219, 254); // blue-200
  doc.text('FINAL VERIFIED STUDY RESULT', margin + 6, currentY + 6);

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  const plainResult = formatLatexForPDF(solution.finalAnswer);
  doc.text(plainResult, margin + 6, currentY + 14);
  currentY += 30;

  // 7. Pro Tip
  ensureSpace(25);
  doc.setFillColor(240, 253, 250); // emerald-50
  doc.setDrawColor(204, 251, 241); // emerald-200
  doc.setLineWidth(0.3);
  const tipText = `Arch-Tip: ${solution.proTip}`;
  const tipLines = doc.splitTextToSize(tipText, contentWidth - 10);
  const tipBoxHeight = tipLines.length * 5 + 8;
  
  ensureSpace(tipBoxHeight + 5);
  doc.rect(margin, currentY, contentWidth, tipBoxHeight, 'FD');
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // emerald-600
  doc.text(tipLines, margin + 5, currentY + 6);

  // Trigger Save Dialog
  const cleanFilename = solution.problemStatement
    .replace(/[\\/*?:"<>|]/g, '')
    .substring(0, 30) || 'solution';
  doc.save(`UMA_StudyReport_${cleanFilename.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Exports multiple solutions together as a beautiful offline workbook study package (Workbook PDF).
 */
export function exportStudyWorkbookToPDF(solutions: MathSolution[]): void {
  if (!solutions || solutions.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin; // 170mm
  const footerMargin = 15;

  let currentY = 20;

  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - footerMargin) {
      doc.addPage();
      drawHeader();
      currentY = 25;
    }
  };

  const drawHeader = () => {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text('UNIVERSAL MATH ARCHITECT', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('OFFLINE RECONSTRUCTION WORKBOOK', pageWidth - margin - 65, 9);

    doc.setFontSize(7);
    doc.text(`Offline Personal Workbook | Compiled: ${new Date().toLocaleDateString()}`, margin, pageHeight - 8);
  };

  // --- COVER PAGE ---
  drawHeader();
  
  // Big visual cover section
  currentY = 50;
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(margin, currentY, contentWidth, 80, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('My Math Study Log', margin + 10, currentY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(191, 219, 254); // blue-200
  doc.text('Step-by-Step Problem Solutions Compilation', margin + 10, currentY + 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Total Practice Problems: ${solutions.length}`, margin + 10, currentY + 54);
  doc.text(`Date of Compilation: ${new Date().toLocaleDateString()}`, margin + 10, currentY + 62);

  // Description block
  currentY = 150;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Workbook Description & Guidelines:', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const guideLines = doc.splitTextToSize(
    'This workbook contains detailed logical reconstructions of math concepts processed during active learning sessions. Each problem includes strategies, core theorems, clear sequence steps, and custom tips. Use this guide to reinforce problem-solving, double-check test revisions, and perfect your computational logical steps offline.',
    contentWidth
  );
  doc.text(guideLines, margin, currentY);
  
  // Loop and print each solved problem starting on a fresh page
  solutions.forEach((solution, sIndex) => {
    doc.addPage();
    drawHeader();
    currentY = 25;

    // Header block for this specific problem
    ensureSpace(20);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    doc.setDrawColor(219, 234, 254); // blue-100
    doc.setLineWidth(1);
    doc.line(margin, currentY, margin, currentY + 18);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Equation Target #${sIndex + 1} (${solution.level})`, margin + 6, currentY + 7);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('STUDY WORKBOOK SECTION', margin + 6, currentY + 13);
    currentY += 25;

    // Problem Statement
    ensureSpace(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text('PROBLEM EQUATION:', margin, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    const plainProblem = formatLatexForPDF(solution.problemStatement);
    const probLines = doc.splitTextToSize(plainProblem, contentWidth);
    doc.text(probLines, margin, currentY);
    currentY += probLines.length * 6 + 10;

    // Strategy
    ensureSpace(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text('STRATEGY:', margin, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const stratLines = doc.splitTextToSize(solution.strategy, contentWidth);
    doc.text(stratLines, margin, currentY);
    currentY += stratLines.length * 5 + 8;

    // Core Concept
    ensureSpace(25);
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.3);
    const conceptText = `Core Theorem: ${solution.coreConcept}`;
    const conceptLines = doc.splitTextToSize(conceptText, contentWidth - 8);
    const boxHeight = conceptLines.length * 5 + 8;
    
    ensureSpace(boxHeight + 5);
    doc.rect(margin, currentY, contentWidth, boxHeight, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216);
    doc.text(conceptLines, margin + 4, currentY + 6);
    currentY += boxHeight + 10;

    // Steps Description
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('STEPS & WALKTHROUGH', margin, currentY);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 8;

    // Steps loop
    solution.steps.forEach((step, sIdx) => {
      ensureSpace(35);

      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 7, 'F');

      doc.setFillColor(71, 85, 105); // darker slate-600 for child steps
      doc.rect(margin, currentY, 12, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`S ${sIdx + 1}`, margin + 1.5, currentY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(step.desc, margin + 14, currentY + 4.5);
      currentY += 10;

      // Formula block
      doc.setFont('courier', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(220, 38, 38);
      const stepMath = formatLatexForPDF(step.latex);
      const mathLines = doc.splitTextToSize(`      ${stepMath}`, contentWidth - 10);
      ensureSpace(mathLines.length * 5 + 4);
      doc.text(mathLines, margin + 2, currentY);
      currentY += mathLines.length * 5 + 4;

      // Step explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const explLines = doc.splitTextToSize(step.explanation, contentWidth - 6);
      ensureSpace(explLines.length * 5 + 8);
      doc.text(explLines, margin + 4, currentY);
      currentY += explLines.length * 5 + 8;
    });

    // Final result
    ensureSpace(30);
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(191, 219, 254);
    doc.text('VERIFIED RESULTS', margin + 6, currentY + 5);

    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    const resultPlain = formatLatexForPDF(solution.finalAnswer);
    doc.text(resultPlain, margin + 6, currentY + 12);
    currentY += 24;

    // Pro Tip
    ensureSpace(25);
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(204, 251, 241);
    doc.setLineWidth(0.3);
    const tipText = `Arch-Tip: ${solution.proTip}`;
    const tipLines = doc.splitTextToSize(tipText, contentWidth - 10);
    const tipBoxHeight = tipLines.length * 5 + 8;
    
    ensureSpace(tipBoxHeight + 5);
    doc.rect(margin, currentY, contentWidth, tipBoxHeight, 'FD');
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136);
    doc.text(tipLines, margin + 5, currentY + 5.5);
  });

  // Save full pack
  doc.save(`UMA_Offline_Mathematics_Workbook.pdf`);
}
