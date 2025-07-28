import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'

@Injectable()
export class AxiosService {
  private axiosInstance: AxiosInstance

  constructor(private readonly configService: ConfigService) {
    // Set up the axios instance with custom configurations (timeout, base URL, etc.)
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('IAM_SERVICE_URL'), // Change this to the base URL you want to use
      timeout: 5000, // Set a timeout (optional)
    })
  }

  // GET request
  async getRequest(url: string, params: any = {}): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url, { params })
      return response
    } catch (error) {
      return this.handleError(error)
    }
  }

  // POST request
  async postRequest(url: string, config: AxiosRequestConfig, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, data, config)
      return response
    } catch (error) {
      return this.handleError(error)
    }
  }

  // PUT request
  async putRequest(url: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(url, data)
      return response
    } catch (error) {
      return this.handleError(error)
    }
  }

  // DELETE request
  async deleteRequest(url: string, params: any = {}): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(url, { params })
      return response
    } catch (error) {
      return this.handleError(error)
    }
  }

  // Handle error response
  private handleError(error: AxiosError) {
    // Customize error handling as needed
    if (error.response) {
      // Request was made and server responded with a status code
      console.error('Response error:', error.response.data)
      console.error('Response status:', error.response.status)
      return {
        message: error.response.data,
        statusCode: error.response.status,
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Request error:', error.request)
      return { message: 'No response from server', statusCode: 500 }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
      return { message: error.message, statusCode: 500 }
    }
  }
}
