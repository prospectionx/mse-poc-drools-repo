package com.jnj.mse;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class KeyIndividual implements java.io.Serializable {

	static final long serialVersionUID = 1L;

	private java.lang.String code;
	private java.lang.String name;

	public KeyIndividual() {
	}

	public java.lang.String getCode() {
		return this.code;
	}

	public void setCode(java.lang.String code) {
		this.code = code;
	}

	public java.lang.String getName() {
		return this.name;
	}

	public void setName(java.lang.String name) {
		this.name = name;
	}

	public KeyIndividual(java.lang.String code, java.lang.String name) {
		this.code = code;
		this.name = name;
	}

}