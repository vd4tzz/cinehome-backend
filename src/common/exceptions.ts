import { ApiProperty } from "@nestjs/swagger";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

export enum ErrorCode {
  EMAIL_EXISTED = "EMAIL_EXISTED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_VERIFIED = "USER_VERIFIED",
  INVALID_TOKEN = "INVALID_TOKEN",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
  INVALID_CREDENTIAL = "INVALID_CREDENTIAL",
  INVALID_FORMAT = "INVALID_FORMAT",
  CONFLICT_OAUTH2_PROVIDER = "CONFLICT_OAUTH2_PROVIDER",
  INVALID_JSON_WEB_TOKEN = "INVALID_JSON_WEB_TOKEN",
}

export class ErrorResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: ErrorCode;

  constructor(partial: Partial<ErrorResponse>) {
    Object.assign(this, partial);
  }
}

export class EmailExistedException extends ConflictException {
  constructor() {
    super(
      new ErrorResponse({
        message: "cannot signup because email is existed",
        code: ErrorCode.EMAIL_EXISTED,
      }),
    );
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(
      new ErrorResponse({
        message: "user not found",
        code: ErrorCode.USER_NOT_FOUND,
      }),
    );
  }
}

export class UserAlreadyVerifiedException extends BadRequestException {
  constructor() {
    super(
      new ErrorResponse({
        message: "a verified user cannot perform this action",
        code: ErrorCode.USER_VERIFIED,
      }),
    );
  }
}

export class InvalidTokenException extends BadRequestException {
  constructor() {
    super(
      new ErrorResponse({
        message: "invalid token",
        code: ErrorCode.INVALID_TOKEN,
      }),
    );
  }
}

export class UserNotVerifiedException extends ForbiddenException {
  constructor() {
    super(
      new ErrorResponse({
        message: "user is not verified",
        code: ErrorCode.USER_NOT_VERIFIED,
      }),
    );
  }
}

export class InvalidCredentialException extends UnauthorizedException {
  constructor() {
    super(
      new ErrorResponse({
        message: "invalid email or password",
        code: ErrorCode.INVALID_CREDENTIAL,
      }),
    );
  }
}

export class ConflictAuthenticationMethodException extends ConflictException {
  constructor(message?: string) {
    super(
      new ErrorResponse({
        message: message ?? "account is registered with other method",
        code: ErrorCode.CONFLICT_OAUTH2_PROVIDER,
      }),
    );
  }
}

export class InvalidJsonWebToken extends UnauthorizedException {
  constructor() {
    super(
      new ErrorResponse({
        message: "invalid json web token",
        code: ErrorCode.INVALID_JSON_WEB_TOKEN,
      }),
    );
  }
}
