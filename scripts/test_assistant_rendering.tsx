import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AssistantMessage } from '../src/components/ai/AssistantMessage';
const html = renderToStaticMarkup(<AssistantMessage content={'## Your options\n\n- **Air:** fastest\n- Road: flexible\n\n| Mode | Time |\n| --- | --- |\n| Air | Check schedule |\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))'} />);
assert.match(html, /<h3/); assert.match(html, /<ul/); assert.match(html, /<strong/);
assert.match(html, /<table/); assert.match(html, /<th/); assert.match(html, /Check schedule/);
assert.doesNotMatch(html, /<script|href="javascript:|\| --- \|/);
console.log('PASS: readable headings, bullets, table rendering and unsafe HTML/link suppression.');
