import { shallow} from 'enzyme';
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import { create } from 'react-test-renderer'
import App from './App';
import { SomeRouter } from './App'

/**
 * component数を確認する。
 */
test(`component length value`, () => {
  /** 準備 */
  // Appコンポーネントをshallowレンダリング
  const wrapper = shallow(<App />);

  /** 検証 */
  // 各component数を検証
  expect(wrapper.find(Router).length).toBe(1);
});

/**
 * LoginComponentがレンダリングされることを確認する。
 */
test('renderer loginComponent', () => {
  /** 準備 */
  const component = shallow(
    <MemoryRouter initialEntries={['/icos']}>
      <SomeRouter />
    </MemoryRouter>
  );
  /** 検証 */
  expect(component.render().length).toBe(1);
});

/**
 * snapshotのテスト
 */
describe("snapshot test", () => {

  /**
   * LoginComponentが表示されることを確認する。
   */
  test('loginComponent /icos', () => {
    /** 準備 */
    const tree = create(
      <MemoryRouter initialEntries={['/icos']}>
        <SomeRouter />
      </MemoryRouter>
    ).toJSON();
    /** 検証 */
    expect(tree).toMatchSnapshot();
  });

  /**
   * LoginComponentが表示されることを確認する。
   */
  test('loginComponent /icos/login', () => {
    /** 準備 */
    const tree = create(
      <MemoryRouter initialEntries={['/icos/login']}>
        <SomeRouter />
      </MemoryRouter>
    ).toJSON();
    /** 検証 */
    expect(tree).toMatchSnapshot();
  });
});