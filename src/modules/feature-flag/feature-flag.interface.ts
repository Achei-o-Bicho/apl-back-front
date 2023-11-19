export interface IFeatureFlag<T> {
  id: string;
  flag: string;
  isEnabled: boolean;
  config: T;
}
