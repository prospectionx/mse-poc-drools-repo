package com.jnj.mse;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class InteractionCount implements java.io.Serializable {

	static final long serialVersionUID = 1L;

	private com.jnj.mse.AggregateCount aggregate;

	public InteractionCount() {
	}

	public com.jnj.mse.AggregateCount getAggregate() {
		return this.aggregate;
	}

	public void setAggregate(com.jnj.mse.AggregateCount aggregate) {
		this.aggregate = aggregate;
	}

	public InteractionCount(com.jnj.mse.AggregateCount aggregate) {
		this.aggregate = aggregate;
	}

}