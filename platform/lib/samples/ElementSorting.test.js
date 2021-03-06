/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('ElementSorting', () => {
  const CodeSection = require('./CodeSection');
  const Document = require('./Document');
  const elementSorting = require('./ElementSorting');

  const body = '<body><div></div>';
  const appBanner = '<amp-app-banner><child></child></amp-app-banner>';
  const sidebar = '<amp-sidebar><child></child></amp-sidebar>';
  const nestedAppBanner = '<div>' + appBanner + '</div>';

  const multiLineBody = '\n<body>\n<div></div>';
  const multiLineSidebar = '\n<amp-sidebar>\n<child>\n\n</child></amp-sidebar>';
  const sidebarWithAttribute = '<amp-sidebar id="menu"><child></child></amp-sidebar>';

  beforeEach(() => {
    doc = new Document();
  });

  describe('amp-app-banner', () => {
    it('removes amp-app-banner', () => {
      const sectionWithAppBanner = addSection(appBanner);
      elementSorting.apply(doc);
      expect(sectionWithAppBanner.preview).toBe('');
    });

    it('removes nested amp-app-banner', () => {
      const sectionWithAppBanner = addSection(nestedAppBanner);
      elementSorting.apply(doc);
      expect(sectionWithAppBanner.preview).toBe('<div></div>');
    });

    it('appends amp-app-banner after body', () => {
      addSection(body);
      addSection(nestedAppBanner);
      elementSorting.apply(doc);
      expect(doc.elementsAfterBody).toBe(appBanner);
    });
  });

  describe('amp-sidebar', () => {
    it('removes amp-sidebar', () => {
      const sectionWithSidebar = addSection(sidebar);
      elementSorting.apply(doc);
      expect(sectionWithSidebar.preview).toBe('');
    });
    it('removes multiple sidebars', () => {
      addSection(sidebar);
      const secondSection = addSection(sidebar);
      elementSorting.apply(doc);
      expect(secondSection.preview).toBe('');
    });
    it('appends amp-sidebar after body', () => {
      addSection(body);
      addSection(sidebar);
      elementSorting.apply(doc);
      expect(doc.elementsAfterBody).toBe(sidebar);
    });
  });

  describe('parsing matches', () => {
    it('body with multiple lines', () => {
      addSection(multiLineBody);
      addSection(sidebar);
      elementSorting.apply(doc);
      expect(strip(doc.elementsAfterBody)).toBe(sidebar);
    });
    it('element with multiple lines', () => {
      addSection(body);
      addSection(multiLineSidebar);
      elementSorting.apply(doc);
      expect(strip(doc.elementsAfterBody)).toBe(strip(multiLineSidebar));
    });
    it('element with attributes', () => {
      addSection(body);
      addSection(sidebarWithAttribute);
      elementSorting.apply(doc);
      expect(doc.elementsAfterBody).toBe(sidebarWithAttribute);
    });
  });

  it('places sidebar directly after body', () => {
    addSection(sidebar);
    addSection(appBanner);
    elementSorting.apply(doc);
    expect(doc.elementsAfterBody).toBe(sidebar + appBanner);
  });

  function strip(string) {
    return string.replace(/\n/g, '');
  }

  function addSection(string) {
    const cs = new CodeSection();
    cs.preview = string;
    doc.addSection(cs);
    return cs;
  };
});

