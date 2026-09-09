/**
 * Automated Verification Test Suite for Phase 6:
 * - Shared UI Primitives (Button, Card, Input, Modal, Badge, Skeleton)
 * - Accessibility (WCAG AA skip link, aria-labels, focus rings, role="dialog")
 * - 3D Monument Registry & Flagship Architectural Geometry (Hawa Mahal added)
 * - Responsive Layout & Mobile Viewport Safety
 */

import fs from 'fs';
import path from 'path';
import * as UI from '../src/components/ui/index.ts';
import { MONUMENT_REGISTRY, buildHawaMahalGeometry, FALLBACK_IMAGES } from '../src/components/threed/monumentGeometries.ts';

async function runPhase6Tests() {
  console.log('🚀 [Test] Starting Phase 6: Design System, Accessibility & 3D Accuracy Verification...\n');

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

  // -------------------------------------------------------------
  // Test Suite 1: Shared UI Primitives Export & Contracts
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Shared UI Primitives Module Verification ---');
  assert(typeof UI.Button === 'object' || typeof UI.Button === 'function', 'Button component exported from src/components/ui');
  assert(typeof UI.Card === 'object' || typeof UI.Card === 'function', 'Card container exported from src/components/ui');
  assert(typeof UI.CardHeader === 'object' || typeof UI.CardHeader === 'function', 'CardHeader subcomponent exported');
  assert(typeof UI.CardTitle === 'object' || typeof UI.CardTitle === 'function', 'CardTitle subcomponent exported');
  assert(typeof UI.CardDescription === 'object' || typeof UI.CardDescription === 'function', 'CardDescription subcomponent exported');
  assert(typeof UI.CardContent === 'object' || typeof UI.CardContent === 'function', 'CardContent subcomponent exported');
  assert(typeof UI.CardFooter === 'object' || typeof UI.CardFooter === 'function', 'CardFooter subcomponent exported');
  assert(typeof UI.Input === 'object' || typeof UI.Input === 'function', 'Input component exported from src/components/ui');
  assert(typeof UI.Modal === 'function', 'Modal component exported from src/components/ui');
  assert(typeof UI.Badge === 'function', 'Badge component exported from src/components/ui');
  assert(typeof UI.Skeleton === 'function', 'Skeleton component exported from src/components/ui');

  // -------------------------------------------------------------
  // Test Suite 2: Accessibility & WCAG AA Compliance
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Accessibility & WCAG AA Compliance ---');
  const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  assert(appTsx.includes('href="#main-content"'), 'App.tsx contains WCAG skip-to-content anchor (#main-content)');
  assert(appTsx.includes('id="main-content"'), 'App.tsx designates main content area with id="main-content"');
  assert(appTsx.includes('tabIndex={-1}'), 'Main content container is focusable via keyboard skip link (tabIndex={-1})');

  const buttonTsx = fs.readFileSync(path.resolve('src/components/ui/Button.tsx'), 'utf-8');
  assert(buttonTsx.includes('focus-visible:ring-2'), 'Button primitive enforces high-contrast focus-visible rings');
  assert(buttonTsx.includes('aria-disabled'), 'Button primitive binds aria-disabled when inactive');
  assert(buttonTsx.includes('aria-busy'), 'Button primitive binds aria-busy during loading states');

  const modalTsx = fs.readFileSync(path.resolve('src/components/ui/Modal.tsx'), 'utf-8');
  assert(modalTsx.includes('role="dialog"'), 'Modal primitive binds accessible role="dialog"');
  assert(modalTsx.includes('aria-modal="true"'), 'Modal primitive declares aria-modal="true"');
  assert(modalTsx.includes('aria-label="Close dialog"'), 'Modal close button specifies accessible aria-label');
  assert(modalTsx.includes('Escape'), 'Modal listener traps and handles Escape key dismissals');

  const inputTsx = fs.readFileSync(path.resolve('src/components/ui/Input.tsx'), 'utf-8');
  assert(inputTsx.includes('aria-invalid'), 'Input primitive binds accessible aria-invalid attribute');
  assert(inputTsx.includes('aria-describedby'), 'Input primitive links errors/helpers via aria-describedby');

  // -------------------------------------------------------------
  // Test Suite 3: 3D Monument Registry & Flagship Accuracy
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: 3D Monument Registry & Flagship Accuracy ---');
  const requiredMonuments = [
    'gateway-of-india',
    'taj-mahal',
    'qutub-minar',
    'konark-sun-temple',
    'hampi-stone-temple',
    'amber-palace',
    'hawa-mahal',
  ];

  for (const mId of requiredMonuments) {
    const entry = MONUMENT_REGISTRY[mId];
    assert(entry !== undefined, `Monument registry contains flagship landmark: ${mId}`);
    assert(typeof entry?.builder === 'function', `Monument ${mId} provides executable 3D geometry builder`);
  }

  assert(typeof buildHawaMahalGeometry === 'function', 'buildHawaMahalGeometry builder is exported');
  assert(FALLBACK_IMAGES['hawa-mahal'] !== undefined, 'Hawa Mahal fallback photograph is defined');

  const destDetailTsx = fs.readFileSync(path.resolve('src/pages/DestinationDetailPage.tsx'), 'utf-8');
  assert(destDetailTsx.includes("'hawa-mahal'"), 'DestinationDetailPage resolves Hawa Mahal to 3D monument type');

  // -------------------------------------------------------------
  // Test Suite 4: Responsive & Mobile Viewport Safety
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Responsive & Mobile Viewport Safety ---');
  const routeCalcTsx = fs.readFileSync(path.resolve('src/components/destination/RouteCalculator.tsx'), 'utf-8');
  assert(routeCalcTsx.includes('aria-pressed={isSelected}'), 'RouteCalculator provides aria-pressed states on transport buttons');
  assert(routeCalcTsx.includes('Card') && routeCalcTsx.includes('Badge'), 'RouteCalculator utilizes shared Card and Badge primitives');

  const visualizerTsx = fs.readFileSync(path.resolve('src/components/destination/MultimodalRoute3DVisualizer.tsx'), 'utf-8');
  assert(visualizerTsx.includes('flex flex-col sm:flex-row'), 'MultimodalRoute3DVisualizer wraps gracefully on small viewports');
  assert(visualizerTsx.includes('min-w-0'), 'MultimodalRoute3DVisualizer uses min-w-0 to prevent text overflow clipping');

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
