import {
  Destination,
  ServiceLocation,
  ServiceLocationRepository,
} from "../repositories/service-location.repository";
import { OperatorRepository } from "../repositories/operator.repository";

export class ServiceLocationService {
  constructor(
    private serviceLocationRepository: ServiceLocationRepository,
    private operatorRepository: OperatorRepository
  ) {}

  async getByOperatorId(
    operatorId: number
  ): Promise<ServiceLocation[]> {
    const operator = await this.operatorRepository.findById(operatorId);

    if (!operator) {
      throw new Error("OPERADOR_NO_ENCONTRADO");
    }

    return this.serviceLocationRepository.findAllByOperatorId(
      operatorId
    );
  }

  async getAllActiveDestinations(): Promise<Destination[]> {
    return this.serviceLocationRepository.findAllActiveDestinations();
  }
}
