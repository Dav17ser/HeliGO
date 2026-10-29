import { Operator } from "../data/models/operator.model";
import { OperatorRepository } from "../repositories/operator.repository";

export class OperatorService {
  constructor(private operatorRepository: OperatorRepository) {}

  async getAll(): Promise<Operator[]> {
    return this.operatorRepository.findAll();
  }

  async getById(id: number): Promise<Operator | undefined> {
    return this.operatorRepository.findById(id);
  }
}
