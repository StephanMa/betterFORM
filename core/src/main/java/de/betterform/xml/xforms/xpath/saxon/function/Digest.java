/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */

package de.betterform.xml.xforms.xpath.saxon.function;

import de.betterform.xml.xforms.XFormsElement;
import de.betterform.xml.xforms.exception.XFormsComputeException;
import net.sf.saxon.expr.Expression;
import net.sf.saxon.expr.XPathContext;
import net.sf.saxon.expr.parser.ExpressionVisitor;
import net.sf.saxon.om.Item;
import net.sf.saxon.om.Sequence;
import net.sf.saxon.trans.XPathException;
import net.sf.saxon.value.StringValue;
import org.apache.commons.codec.BinaryEncoder;
import org.apache.commons.codec.EncoderException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Implementation of 7.8.3 The digest() Function
 * 
 * This function accepts a string of data, a string indicating a cryptographic
 * hashing algorithm, and an optional string indicating an encoding method. The
 * data string is serialized as UTF-8, the hash value is then computed using the
 * indicated hash algorithm, and the hash value is then encoded by the indicated
 * method, and the result is returned by the function.
 * 
 * @author Nick Van den Bleeken
 * @version $Id$
 */
public class Digest extends XFormsFunction {
    private static final String kBASE64 = "base64";
    private static final Set<String> kSUPPORTED_ALG = new HashSet<String>(Arrays.asList(new String[] { "MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512" }));
    private static final Set<String> kSUPPORTED_ENCODINGS = new HashSet<String>(Arrays.asList(new String[]{ kBASE64, "hex" }));

    private static final long serialVersionUID = -8331394395194343808L;

    /**
     * Pre-evaluate a function at compile time. Functions that do not allow
     * pre-evaluation, or that need access to context information, can override this method.
     * @param visitor an expression visitor
     * @return the result of the early evaluation, or the original expression, or potentially
     * a simplified expression
     */
	@Override
    public Expression preEvaluate(final ExpressionVisitor visitor) throws XPathException {
		return this;
    }

    /**
     * Evaluate in a general context
     */
	@Override
    public Item evaluateItem(final XPathContext xpathContext) throws XPathException {

		// XXX In some cases the xforms-compute-exception should be an xforms-bind-exception

		final String data = argument[0].evaluateAsString(
			xpathContext).toString();
		final String algorithm = argument[1].evaluateAsString(
			xpathContext).toString();
		final String encoding = argument != null && argument.length >= 3 ? argument[2].evaluateAsString(
			xpathContext).toString() : kBASE64;

		return digest(xpathContext, data, algorithm, encoding);
	}

	public Sequence call(final XPathContext context,
						 final Sequence[] arguments) throws XPathException {
		final String data = arguments[0].head().getStringValue();
		final String algorithm = arguments[1].head().getStringValue();
		final String encoding = arguments.length >=3 ? arguments[2].head().getStringValue() : kBASE64;

		return digest(context, data, algorithm, encoding);
	}

	private StringValue digest(final XPathContext context, final String data, final String algorithm, final String encoding) throws XPathException {
		if (!kSUPPORTED_ALG.contains(algorithm)) {
			final XPathFunctionContext functionContext = getFunctionContext(context);
			final XFormsElement xformsElement = functionContext.getXFormsElement();
			throw new XPathException(new XFormsComputeException("Unsupported algorithm '" + algorithm + "'", xformsElement.getTarget(), this));
		}

		if (!kSUPPORTED_ENCODINGS.contains(encoding)) {
			final XPathFunctionContext functionContext = getFunctionContext(context);
			final XFormsElement xformsElement = functionContext.getXFormsElement();
			throw new XPathException(new XFormsComputeException("Unsupported encoding '" + encoding + "'", xformsElement.getTarget(), this));
		}

		MessageDigest messageDigest;
		try {
			messageDigest = MessageDigest.getInstance(algorithm);
			messageDigest.update(data.getBytes("utf-8"));

			byte[] digest = messageDigest.digest();

			final BinaryEncoder encoder;
			if ("base64".equals(encoding)) {
				encoder = new Base64(digest.length, "".getBytes(), false);
			} else {
				encoder = new Hex();
			}
			return new StringValue(new String(encoder.encode(digest), "ASCII"));

		} catch (final NoSuchAlgorithmException e) {
			throw new XPathException(e);
		} catch (final UnsupportedEncodingException e) {
			throw new XPathException(e);
		} catch (final EncoderException e) {
			final XPathFunctionContext functionContext = getFunctionContext(context);
			final XFormsElement xformsElement = functionContext.getXFormsElement();
			throw new XPathException(new XFormsComputeException("Encoder exception.", e, xformsElement.getTarget(), this));
		}

    }
}
