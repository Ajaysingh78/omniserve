import { SimulatorProvider } from "./simulator-provider.interface.js";
import { SwiggySimulator } from "./swiggy.simulator.js";
import { ZomatoSimulator } from "./zomato.simulator.js";
import { WebsiteSimulator } from "./website.simulator.js";
import { QrSimulator } from "./qr.simulator.js";

class Registry {
  private providers = new Map<string, SimulatorProvider>();

  constructor() {
    this.register(new SwiggySimulator());
    this.register(new ZomatoSimulator());
    this.register(new WebsiteSimulator());
    this.register(new QrSimulator());
  }

  register(provider: SimulatorProvider) {
    this.providers.set(provider.provider.toUpperCase(), provider);
  }

  get(name: string): SimulatorProvider | undefined {
    return this.providers.get(name.toUpperCase());
  }

  getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const SimulatorRegistry = new Registry();
export default SimulatorRegistry;
