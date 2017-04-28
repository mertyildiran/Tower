import { TowerPage } from './app.po';

describe('tower App', () => {
  let page: TowerPage;

  beforeEach(() => {
    page = new TowerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
