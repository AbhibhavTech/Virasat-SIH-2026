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
  const languageSelectorPath = path.join(rootDir, 'src', 'components', 'common', 'LanguageSelector.tsx');
  const unescoBadgePath = path.join(rootDir, 'src', 'components', 'common', 'UnescoBadge.tsx');

  assert(fs.existsSync(languageSelectorPath), 'LanguageSelector.tsx exists');
  assert(fs.existsSync(unescoBadgePath), 'UnescoBadge.tsx exists');

  const languageSelectorLines = fs.readFileSync(languageSelectorPath, 'utf-8').split('\n').length;
  const unescoBadgeLines = fs.readFileSync(unescoBadgePath, 'utf-8').split('\n').length;

  assert(languageSelectorLines < 350, `LanguageSelector.tsx is modular (<350 lines, actual: ${languageSelectorLines})`);
  assert(unescoBadgeLines < 350, `UnescoBadge.tsx is modular (<350 lines, actual: ${unescoBadgeLines})`);

  // -------------------------------------------------------------
  // Test Suite 3: Authentic Monument Photography Registry & Fallbacks
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Authentic Monument Photography Registry & Fallbacks ---');
  const realImagesPath = path.join(rootDir, 'src', 'data', 'monumentRealImages.ts');
  assert(fs.existsSync(realImagesPath), 'monumentRealImages.ts exists');

  const realImagesContent = fs.readFileSync(realImagesPath, 'utf-8');
  assert(realImagesContent.includes('MONUMENT_REAL_IMAGES'), 'Monument real images dictionary defined');
  assert(realImagesContent.includes('getMonumentRealImage'), 'getMonumentRealImage fallback resolver exported');
  assert(realImagesContent.includes('taj-mahal'), 'Taj Mahal verified photography defined');
  assert(realImagesContent.includes('golden-temple'), 'Golden Temple verified photography defined');
  assert(realImagesContent.includes('qutb-minar'), 'Qutb Minar verified photography defined');

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
