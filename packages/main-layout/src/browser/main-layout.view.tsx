import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConfigContext, SlotRenderer, ConfigProvider } from '@ali/ide-core-browser';
import { observer } from 'mobx-react-lite';
import { SlotLocation } from '../common/main-layout-slot';
import { MainLayoutService } from './main-layout.service';
import {
  SplitPanel,
  Widget,
  BoxPanel,
  BoxLayout,
} from '@phosphor/widgets';
import { IdeWidget } from './ide-widget.view';
import './main-layout.less';
import { ActivatorBarModule } from '@ali/ide-activator-bar/lib/browser';
import { ActivatorPanelModule } from '@ali/ide-activator-panel/lib/browser';
import { BottomPanelModule } from '@ali/ide-bottom-panel/lib/browser';

export const MainLayout = observer(() => {
  const configContext = React.useContext(ConfigContext);
  const { injector, layoutConfig } = configContext;

  const mainLayoutService = injector.get(MainLayoutService);
  const ref = React.useRef<HTMLElement | null>();

  React.useEffect(function widgetsInit() {

    if (ref.current) {
      // const mainLayoutBox = new BoxPanel({direction: 'top-to-bottom', spacing: 0});
      const menuBarWidget = injector.get(IdeWidget, [SlotLocation.menuBar, configContext]);
      menuBarWidget.id = 'menu-bar';

      const horizontalBoxLayout = new SplitPanel({ orientation: 'horizontal', spacing: 0 });
      horizontalBoxLayout.id = 'main-box';
      const resizeLayout = new SplitPanel({ orientation: 'horizontal', spacing: 0 });
      // const leftSlotWidget = injector.get(IdeWidget, [SlotLocation.leftPanel, configContext]);
      const activatorBarWidget = injector.get(IdeWidget, ['', configContext, injector.get(ActivatorBarModule).component]);
      activatorBarWidget.id = 'activator-bar';
      const activatorPanelWidget = injector.get(IdeWidget, [SlotLocation.left, configContext, injector.get(ActivatorPanelModule).component]);

      const middleWidget = new SplitPanel({orientation: 'vertical', spacing: 0});
      // TODO 顶部占位slotWidget
      const topSlotWidget = injector.get(IdeWidget, [SlotLocation.main, configContext]);
      const bottomSlotWidget = injector.get(IdeWidget, [SlotLocation.bottom, configContext, injector.get(BottomPanelModule).component]);
      const subsidiarySlotWidget = injector.get(IdeWidget, [SlotLocation.right, configContext]);
      const statusBarWidget = injector.get(IdeWidget, ['statusBar', configContext]);
      statusBarWidget.id = 'status-bar';

      resizeLayout.addWidget(activatorPanelWidget);
      middleWidget.addWidget(topSlotWidget);
      middleWidget.addWidget(bottomSlotWidget);
      resizeLayout.addWidget(middleWidget);
      resizeLayout.addWidget(subsidiarySlotWidget);

      resizeLayout.setRelativeSizes(mainLayoutService.horRelativeSizes.pop() || MainLayoutService.initHorRelativeSizes);
      middleWidget.setRelativeSizes(mainLayoutService.verRelativeSizes.pop() || MainLayoutService.initVerRelativeSizes);

      horizontalBoxLayout.addWidget(activatorBarWidget);
      horizontalBoxLayout.addWidget(resizeLayout);

      Widget.attach(menuBarWidget, ref.current);
      Widget.attach(horizontalBoxLayout, ref.current);
      Widget.attach(statusBarWidget, ref.current);

      /*
      mainLayoutBox.addWidget(menuBarWidget);
      mainLayoutBox.addWidget(horizontalBoxLayout);
      mainLayoutBox.addWidget(statusBarWidget);
      Widget.attach(mainLayoutBox, ref.current);
      */

      mainLayoutService.registerSlot(SlotLocation.subsidiaryPanel, subsidiarySlotWidget);
      mainLayoutService.registerSlot(SlotLocation.activatorPanel, activatorPanelWidget);
      mainLayoutService.registerSlot(SlotLocation.bottomPanel, bottomSlotWidget);
      mainLayoutService.resizeLayout = resizeLayout;
      mainLayoutService.middleLayout = middleWidget;

      for (const location of Object.keys(layoutConfig)) {
        if (location === 'top') {
          const module = injector.get(layoutConfig[location].modules[0]);
          menuBarWidget.setComponent(module.component);
        } else if (location === 'main') {
          const module = injector.get(layoutConfig[location].modules[0]);
          topSlotWidget.setComponent(module.component);
        } else if (location === 'left' || location === 'bottom') {
          layoutConfig[location].modules.forEach((Module) => {
            const module = injector.get(Module);
            const useTitle = location === 'bottom';
            mainLayoutService.registerTabbarComponent(module.component as React.FunctionComponent, useTitle ? module.title : module.iconClass, location);
          });
        } else if (location === 'bottomBar') {
          const module = injector.get(layoutConfig[location].modules[0]);
          statusBarWidget.setComponent(module.component);
        }
      }

      let windowResizeListener;
      let windowResizeTimer;
      window.addEventListener('resize', windowResizeListener = () => {
        windowResizeTimer = window.setTimeout(() => {
          clearTimeout(windowResizeTimer);
          horizontalBoxLayout.update();
          middleWidget.update();
        }, 50);
      });

      return function destory() {
        window.removeEventListener('resize', windowResizeListener);
        Widget.detach(menuBarWidget);
        Widget.detach(horizontalBoxLayout);
        Widget.detach(statusBarWidget);
      };
    }
  }, [ref]);

  return (
    <div id='main-layout' ref={(ele) => ref.current = ele} />
  );
});
