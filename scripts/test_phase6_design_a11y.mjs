/**
 * Automated Verification Test Suite for Phase 6:
 * - Shared UI Primitives Design System (Button, Badge, Card, Modal, Tabs)
 * - WCAG AA Compliance (contrast, focus indicators, keyboard navigation, landmarks, skip-link)
 * - Responsive Mobile Audit (touch targets >= 44x44px, mobile drawer navigation)
 * - 3D Monument Viewer Integrity (modularity <350 lines, honesty disclosure, WebGL fallback)
 */

import fs from 'fs';
import path from 'path';

async function runPhase6Tests() {
  console.log('🚀 [Test] Starting Phase 6: Design System, Accessibility & 3D Integrity...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const rootDir = process.cwd();

  // -------------------------------------------------------------
  // Test Suite 1: Shared UI Primitives Design System
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Shared UI Primitives Design System ---');
  const uiDir = path.join(rootDir, 'src', 'components', 'ui');
  assert(fs.existsSync(uiDir), 'src/components/ui directory exists');

  const requiredPrimitives = ['Button.tsx', 'Badge.tsx', 'Card.tsx', 'Modal.tsx', 'Tabs.tsx', 'index.ts'];
  for (const file of requiredPrimitives) {
    const filePath = path.join(uiDir, file);
    assert(fs.existsSync(filePath), `Primitive ${file} exists`);
  }

  const buttonContent = fs.readFileSync(path.join(uiDir, 'Button.tsx'), 'utf-8');
  assert(buttonContent.includes('primary') && buttonContent.includes('secondary') && buttonContent.includes('danger'), 'Button supports all required design variants');
  assert(buttonContent.includes('isLoading') && buttonContent.includes('aria-busy'), 'Button supports accessible loading state with aria-busy');
  assert(buttonContent.includes('min-h-[44px]'), 'Button meets WCAG 44px minimum touch target for md size');
  assert(buttonContent.includes('focus-visible:ring-2'), 'Button defines high-contrast focus indicator');

  const badgeContent = fs.readFileSync(path.join(uiDir, 'Badge.tsx'), 'utf-8');
  assert(badgeContent.includes('official') && badgeContent.includes('curated'), 'Badge supports official ASI and curated variants');

  const modalContent = fs.readFileSync(path.join(uiDir, 'Modal.tsx'), 'utf-8');
  assert(modalContent.includes('role="dialog"') && modalContent.includes('aria-modal="true"'), 'Modal implements WAI-ARIA dialog semantics');
  assert(modalContent.includes('Escape'), 'Modal handles ESC key for accessible dismiss');

  const tabsContent = fs.readFileSync(path.join(uiDir, 'Tabs.tsx'), 'utf-8');
  assert(tabsContent.includes('role="tablist"') && tabsContent.includes('role="tab"'), 'Tabs implements WAI-ARIA tablist semantics');
  assert(tabsContent.includes('ArrowRight') && tabsContent.includes('ArrowLeft'), 'Tabs supports keyboard arrow navigation');

  // -------------------------------------------------------------
  // Test Suite 2: Codebase Modularity & Line Limits (<350 lines)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Codebase Modularity & Clean Architecture ---');
  const monument3DPath = path.join(rootDir, 'src', 'components', 'threed', 'InteractiveHeritageMonument3D.tsx');
  const geometriesPath = path.join(rootDir, 'src', 'components', 'threed', 'monumentGeometries.ts');

  assert(fs.existsSync(monument3DPath), 'InteractiveHeritageMonument3D.tsx exists');
  assert(fs.existsSync(geometriesPath), 'monumentGeometries.ts exists');

  const monument3DLines = fs.readFileSync(monument3DPath, 'utf-8').split('\n').length;
  const geometriesLines = fs.readFileSync(geometriesPath, 'utf-8').split('\n').length;

  assert(monument3DLines < 350, `InteractiveHeritageMonument3D.tsx is modular (<350 lines, actual: ${monument3DLines})`);
  assert(geometriesLines < 350, `monumentGeometries.ts is modular (<350 lines, actual: ${geometriesLines})`);

  // -------------------------------------------------------------
  // Test Suite 3: Architectural Honesty & 3D Viewer Integrity
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: 3D Monument Viewer Honesty & Fallbacks ---');
  const viewerContent = fs.readFileSync(monument3DPath, 'utf-8');

  assert(viewerContent.includes('Procedural Geometry') || viewerContent.includes('Architectural Honesty Disclosure'), '3D viewer contains explicit procedural honesty disclosure badge (Blueprint Section XI)');
  assert(viewerContent.includes('webglcontextlost'), '3D viewer registers WebGL context loss listener');
  assert((viewerContent.includes('FALLBACK_IMAGES') || viewerContent.includes('fallbackImages')) && viewerContent.includes('img'), '3D viewer includes high-definition photograph fallback when WebGL fails');
  assert(viewerContent.includes('ArrowLeft') && viewerContent.includes('ArrowRight'), '3D viewer supports keyboard arrow turn controls');
  assert(viewerContent.includes('toggleWireframe'), '3D viewer supports wireframe toggle for architectural polyhedra');

  // -------------------------------------------------------------
  // Test Suite 4: WCAG AA Accessibility & Landmarks
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: WCAG AA Accessibility Landmarks & Semantics ---');
  const appContent = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
  assert(appContent.includes('Skip to main content'), 'App includes accessible Skip-to-content bypass link');
  assert(appContent.includes('id="main-content"'), 'App defines id="main-content" landmark anchor');

  const indexCss = fs.readFileSync(path.join(rootDir, 'src', 'index.css'), 'utf-8');
  assert(indexCss.includes('.focus-ring'), 'index.css defines universal accessible .focus-ring utility');
  assert(indexCss.includes('prefers-reduced-motion'), 'index.css respects user prefers-reduced-motion preference');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert(indexHtml.includes('<html lang="en">'), 'index.html sets document language attribute to en');
  assert(indexHtml.includes('name="viewport"'), 'index.html defines mobile responsive viewport');

  // -------------------------------------------------------------
  // Test Suite 5: Responsive Mobile Navigation & Touch Target Audit
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Responsive Mobile Navigation & Touch Targets ---');
  const topNavContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'TopNavbar.tsx'), 'utf-8');

  assert(topNavContent.includes('min-h-[44px]'), 'TopNavbar adheres to 44px touch target guidelines on interactive controls');
  assert(topNavContent.includes('aria-label="Toggle navigation menu"'), 'Mobile drawer menu button includes accessible aria-label');
  assert(topNavContent.includes('aria-expanded={mobileMenuOpen}'), 'Mobile drawer button tracks aria-expanded state');
  assert(topNavContent.includes('text-stone-800') || topNavContent.includes('text-stone-900'), 'Navigation labels use high-contrast text color');

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 6 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase6Tests().catch((err) => {
  console.error('💥 Fatal error in Phase 6 test runner:', err);
  process.exit(1);
});
